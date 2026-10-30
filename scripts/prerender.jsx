import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../src/components/LandingPage';
import GeoAuditPage from '../src/components/GeoAuditPage';
import GrantQuiz from '../src/components/GrantQuiz';
import PickUpAI from '../src/components/PickUpAI';
import SiteFooter from '../src/components/SiteFooter';

export function render(path) {
  const pages = {
    '/': <LandingPage onGetStarted={() => {}} />,
    '/geo-audit': <GeoAuditPage />,
    '/grants': <GrantQuiz />,
    '/pickupai': <PickUpAI />,
  };
  return renderToString(
    <MemoryRouter initialEntries={[path]}>
      <div className="App font-display min-h-screen flex flex-col">
        {pages[path]}
        {(path === '/' || path === '/geo-audit') && <SiteFooter />}
      </div>
    </MemoryRouter>,
  );
}
