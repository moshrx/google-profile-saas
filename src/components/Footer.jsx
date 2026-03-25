import React from 'react';
import Logo from './Logo';

export default function Footer({ simple = false, onOpenLegal }) {
  const currentYear = new Date().getFullYear();

  if (simple) {
    return (
      <footer className="py-12 border-t border-slate-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-400 text-sm font-medium">
            &copy; {currentYear} ListedPEI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <button onClick={() => onOpenLegal('privacy')} className="text-slate-400 hover:text-primary-600 text-sm font-medium transition-colors">Privacy</button>
             <button onClick={() => onOpenLegal('terms')} className="text-slate-400 hover:text-primary-600 text-sm font-medium transition-colors">Terms</button>
             <a href="https://peiwebstudio.ca" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-bold border-b-2 border-primary-400 hover:text-primary-600 transition-colors">
               PEI Web Studio
             </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="pt-32 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Logo className="w-12 h-12" textClassName="text-2xl" />
            <p className="mt-6 text-slate-500 max-w-xs leading-relaxed text-lg">
              Empowering Prince Edward Island small businesses to stand out on Google with AI-powered marketing tools.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-lg">Product</h4>
            <ul className="space-y-4">
              <li><a href="/#features" className="text-slate-500 hover:text-primary-600 transition-colors">Features</a></li>
              <li><a href="/#how-it-works" className="text-slate-500 hover:text-primary-600 transition-colors">How it works</a></li>
              <li><a href="/#faq" className="text-slate-500 hover:text-primary-600 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-lg">Support</h4>
            <ul className="space-y-4">
              <li><button onClick={() => window.location.href='mailto:peiwebstudio@gmail.com'} className="text-slate-500 hover:text-primary-600 transition-colors">Contact Us</button></li>
              <li><button onClick={() => onOpenLegal('privacy')} className="text-slate-500 hover:text-primary-600 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onOpenLegal('terms')} className="text-slate-500 hover:text-primary-600 transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-slate-500 font-medium">
              &copy; {currentYear} ListedPEI. All rights reserved.
            </p>
            <p className="text-xs text-slate-400">
              Developed by <a href="https://peiwebstudio.ca" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-bold border-b border-primary-400 hover:text-primary-600 transition-colors">PEI Web Studio</a>
            </p>
          </div>
          <p className="text-slate-400 flex items-center gap-2">
            Made with 💙 in <span className="text-slate-900 font-bold border-b-2 border-primary-400">Prince Edward Island</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
