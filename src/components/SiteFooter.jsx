/**
 * Shared footer used by both ListedPEI and PickUp AI pages.
 * Pass `variant="pickupai"` to get the PickUp AI logo + product links.
 * Pass `simple` for the minimal one-line footer used on form/results pages.
 */
import { Link } from 'react-router-dom';
import Logo from './Logo';
import PickUpAILogo from './PickUpAILogo';
import { SUPPORT_EMAIL } from '../utils/constants';

export default function SiteFooter({ variant = 'listedpei', simple = false, onOpenLegal }) {
  const year = new Date().getFullYear();
  const isPickup = variant === 'pickupai';

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (simple) {
    return (
      <footer className="border-t border-slate-100 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs sm:text-sm font-medium text-center sm:text-left">
            &copy; {year} {isPickup ? 'PickUp AI by ListedPEI' : 'ListedPEI'}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => onOpenLegal?.('privacy')} className="text-slate-400 hover:text-primary-600 text-xs sm:text-sm font-medium transition-colors">Privacy</button>
            <button onClick={() => onOpenLegal?.('terms')} className="text-slate-400 hover:text-primary-600 text-xs sm:text-sm font-medium transition-colors">Terms</button>
            <a href="https://peiwebstudio.ca" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-bold border-b-2 border-primary-400 hover:text-primary-600 transition-colors text-xs sm:text-sm">
              PEI Web Studio
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-slate-100 pt-14 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* Top grid: brand + nav columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] gap-10 sm:gap-12 mb-12 sm:mb-16">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            {isPickup ? <PickUpAILogo /> : <Logo />}
            <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-xs">
              {isPickup
                ? 'AI phone agents for PEI businesses. Never miss a call, never lose a customer.'
                : 'Empowering Prince Edward Island small businesses to stand out on Google with AI-powered marketing tools.'}
            </p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="mt-3 inline-block text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
              {SUPPORT_EMAIL}
            </a>
          </div>

          {/* Product links */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-900 mb-4">Product</p>
            <ul className="space-y-3 text-sm text-slate-500">
              {isPickup ? (
                <>
                  <li><button onClick={() => scrollTo('how-it-works')} className="hover:text-primary-600 transition-colors text-left">How it works</button></li>
                  <li><button onClick={() => scrollTo('demo')} className="hover:text-primary-600 transition-colors text-left">Demo</button></li>
                  <li><button onClick={() => scrollTo('pricing')} className="hover:text-primary-600 transition-colors text-left">Pricing</button></li>
                  <li><button onClick={() => scrollTo('faq')} className="hover:text-primary-600 transition-colors text-left">FAQ</button></li>
                </>
              ) : (
                <>
                  <li><Link to="/#features" className="hover:text-primary-600 transition-colors">Features</Link></li>
                  <li><Link to="/#how-it-works" className="hover:text-primary-600 transition-colors">How it works</Link></li>
                  <li><Link to="/grants" className="hover:text-primary-600 transition-colors">Free Grant Check</Link></li>
                  <li><Link to="/pickupai" className="hover:text-primary-600 transition-colors">PickUp AI</Link></li>
                  <li><Link to="/#faq" className="hover:text-primary-600 transition-colors">FAQ</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-900 mb-4">Company</p>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <a href="https://listedpei.ca" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">
                  ListedPEI
                </a>
              </li>
              <li>
                <a href="https://peiwebstudio.ca" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">
                  PEI Web Studio
                </a>
              </li>
              <li>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-primary-600 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-900 mb-4">Legal</p>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <button onClick={() => onOpenLegal?.('privacy')} className="hover:text-primary-600 transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal?.('terms')} className="hover:text-primary-600 transition-colors text-left">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p>&copy; {year} {isPickup ? 'PickUp AI by ListedPEI' : 'ListedPEI'}. All rights reserved.</p>
            <p>Developed by{' '}
              <a href="https://peiwebstudio.ca" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-700 border-b border-primary-400 hover:text-primary-600 transition-colors">
                PEI Web Studio
              </a>
            </p>
          </div>
          <p>Made with care in <span className="font-bold text-slate-700">Prince Edward Island</span></p>
        </div>
      </div>
    </footer>
  );
}
