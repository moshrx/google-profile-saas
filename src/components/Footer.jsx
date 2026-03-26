import React from 'react';
import Logo from './Logo';

export default function Footer({ simple = false, onOpenLegal }) {
  const currentYear = new Date().getFullYear();

  if (simple) {
    return (
      <footer className="py-8 sm:py-12 border-t border-slate-100 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <p className="text-slate-400 text-xs sm:text-sm font-medium text-center sm:text-left">
            &copy; {currentYear} ListedPEI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
             <button onClick={() => onOpenLegal('privacy')} className="text-slate-400 hover:text-primary-600 text-xs sm:text-sm font-medium transition-colors tap-target">Privacy</button>
             <button onClick={() => onOpenLegal('terms')} className="text-slate-400 hover:text-primary-600 text-xs sm:text-sm font-medium transition-colors tap-target">Terms</button>
             <a href="https://peiwebstudio.ca" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-bold border-b-2 border-primary-400 hover:text-primary-600 transition-colors text-xs sm:text-sm">
               PEI Web Studio
             </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="pt-16 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-20">
          <div className="col-span-1 sm:col-span-2">
            <Logo className="w-10 h-10 sm:w-12 sm:h-12" textClassName="text-xl sm:text-2xl" />
            <p className="mt-4 sm:mt-6 text-slate-500 max-w-xs leading-relaxed text-base sm:text-lg">
              Empowering Prince Edward Island small businesses to stand out on Google with AI-powered marketing tools.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4 sm:mb-6 text-base sm:text-lg">Product</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li><a href="/#features" className="text-slate-500 hover:text-primary-600 transition-colors text-sm sm:text-base">Features</a></li>
              <li><a href="/#how-it-works" className="text-slate-500 hover:text-primary-600 transition-colors text-sm sm:text-base">How it works</a></li>
              <li><a href="/#faq" className="text-slate-500 hover:text-primary-600 transition-colors text-sm sm:text-base">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4 sm:mb-6 text-base sm:text-lg">Support</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li><button onClick={() => window.location.href='mailto:peiwebstudio@gmail.com'} className="text-slate-500 hover:text-primary-600 transition-colors text-sm sm:text-base">Contact Us</button></li>
              <li><button onClick={() => onOpenLegal('privacy')} className="text-slate-500 hover:text-primary-600 transition-colors text-sm sm:text-base">Privacy Policy</button></li>
              <li><button onClick={() => onOpenLegal('terms')} className="text-slate-500 hover:text-primary-600 transition-colors text-sm sm:text-base">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p className="text-slate-500 font-medium text-xs sm:text-sm">
              &copy; {currentYear} ListedPEI. All rights reserved.
            </p>
            <p className="text-xs text-slate-400">
              Developed by <a href="https://peiwebstudio.ca" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-bold border-b border-primary-400 hover:text-primary-600 transition-colors">PEI Web Studio</a>
            </p>
          </div>
          <p className="text-slate-400 flex items-center gap-2 text-xs sm:text-sm">
            Made with 💙 in <span className="text-slate-900 font-bold border-b-2 border-primary-400">Prince Edward Island</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
