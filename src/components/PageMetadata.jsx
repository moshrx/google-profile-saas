import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageSeo } from '../utils/seo';

export default function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = getPageSeo(pathname);
    document.title = page.title;
    const meta = (attribute, key, content) => {
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
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
    document.querySelector('link[rel="canonical"]').href = page.url;
    let schema = document.getElementById('page-schema');
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'page-schema';
      schema.type = 'application/ld+json';
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify(page.schema);
  }, [pathname]);
  return null;
}
