import { DEMO_PHONE_RAW, SUPPORT_EMAIL } from './constants.js';

export const SITE_URL = 'https://listedpei.ca';
export const SEO_PAGES = {
  '/': {
    title: 'Free Google Business Profile Kits for PEI | ListedPEI',
    description: 'Create Google Business Profile content for your Prince Edward Island business. Explore free AI visibility checks, grant matching and PickUp AI phone answering.',
    service: 'Google Business Profile content tools',
  },
  '/geo-audit': {
    title: 'Free AI Search Visibility Check for PEI Businesses | ListedPEI',
    description: 'Check how clearly your website explains your business to AI search tools. Get a free website audit with practical improvements from ListedPEI in PEI.',
    service: 'AI search visibility website audit',
  },
  '/grants': {
    title: 'PEI Small Business Grant Matching Quiz | ListedPEI',
    description: 'Explore potential Prince Edward Island business grants with a free matching quiz. Review funding options and confirm eligibility with the program provider.',
    service: 'PEI business grant matching quiz',
  },
  '/pickupai': {
    title: 'PickUp AI: AI Phone Answering for PEI Businesses | ListedPEI',
    description: 'PickUp AI answers business calls, handles common questions and assists with bookings for PEI businesses. Call 902 813 6359 to try the phone agent.',
    service: 'AI phone answering for PEI businesses',
  },
};

export function getPageSeo(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const page = SEO_PAGES[path];
  if (!page) return { title: 'ListedPEI', description: 'ListedPEI business tools.', robots: 'noindex, follow', url: SITE_URL + path, schema: null };
  const url = SITE_URL + (path === '/' ? '/' : path);
  const organizationId = SITE_URL + '/#organization';
  return {
    ...page, url, robots: 'index, follow, max-image-preview:large',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization', '@id': organizationId, name: 'ListedPEI',
          url: SITE_URL + '/', logo: SITE_URL + '/logo.png',
          telephone: DEMO_PHONE_RAW, email: SUPPORT_EMAIL,
          areaServed: { '@type': 'AdministrativeArea', name: 'Prince Edward Island, Canada' },
        },
        {
          '@type': 'WebSite', '@id': SITE_URL + '/#website', name: 'ListedPEI',
          url: SITE_URL + '/', publisher: { '@id': organizationId }, inLanguage: 'en-CA',
        },
        {
          '@type': 'WebPage', '@id': url + '#webpage', url, name: page.title,
          description: page.description, inLanguage: 'en-CA',
          isPartOf: { '@id': SITE_URL + '/#website' },
          about: { '@id': url + '#service' },
        },
        {
          '@type': 'Service', '@id': url + '#service', name: page.service,
          description: page.description, url, provider: { '@id': organizationId },
          areaServed: { '@type': 'AdministrativeArea', name: 'Prince Edward Island, Canada' },
        },
      ],
    },
  };
}
