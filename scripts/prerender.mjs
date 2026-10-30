import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { load } from 'cheerio';
import { SEO_PAGES, getPageSeo } from '../src/utils/seo.js';

const template = await readFile('dist/index.html', 'utf8');
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render } = await server.ssrLoadModule('/scripts/prerender.jsx');
  for (const path of [...Object.keys(SEO_PAGES), '/admin/leads']) {
    const page = getPageSeo(path);
    const $ = load(template);
    $('title').text(page.title);
    const meta = (attribute, key, content) => {
      let element = $(`meta[${attribute}="${key}"]`);
      if (!element.length) element = $('<meta>').attr(attribute, key).appendTo('head');
      element.attr('content', content);
    };
    meta('name', 'title', page.title);
    meta('name', 'description', page.description);
    meta('name', 'robots', page.robots);
    for (const prefix of ['og', 'twitter']) {
      meta('property', `${prefix}:title`, page.title);
      meta('property', `${prefix}:description`, page.description);
      meta('property', `${prefix}:url`, page.url);
    }
    meta('property', 'og:locale', 'en_CA');
    meta('property', 'og:site_name', 'ListedPEI');
    $('link[rel="canonical"]').attr('href', page.url);
    $('script[type="application/ld+json"]').remove();
    if (page.schema) $('<script type="application/ld+json" id="page-schema">').text(JSON.stringify(page.schema).replace(/</g, '\\u003c')).appendTo('head');
    if (SEO_PAGES[path]) $('#root').html(render(path));
    const directory = path === '/' ? 'dist' : `dist${path}`;
    await mkdir(directory, { recursive: true });
    await writeFile(`${directory}/index.html`, $.html());
    console.log(`Prerendered ${path}`);
  }
} finally {
  await server.close();
}
