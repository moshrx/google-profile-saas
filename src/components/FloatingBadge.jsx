import React, { useState, useEffect } from 'react';

export default function FloatingBadge() {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const storedCount = localStorage.getItem('listedpei_badge_count');
    const storedExpiry = localStorage.getItem('listedpei_badge_expiry');
    const storedDismissed = sessionStorage.getItem('listedpei_badge_dismissed');
    const now = new Date().getTime();

    if (storedDismissed) {
      setIsDismissed(true);
      return;
    }

    let finalCount;

    if (storedCount && storedExpiry && now < parseInt(storedExpiry, 10)) {
      finalCount = parseInt(storedCount, 10);
    } else {
      finalCount = Math.floor(Math.random() * (28 - 12 + 1)) + 12;
      localStorage.setItem('listedpei_badge_count', finalCount.toString());
      localStorage.setItem('listedpei_badge_expiry', (now + 7 * 24 * 60 * 60 * 1000).toString());
    }

    setCount(finalCount);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsDismissed(true);
    sessionStorage.setItem('listedpei_badge_dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-50 animate-fade-in-up">
      <div className="bg-slate-900 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-800 flex items-center gap-2 sm:gap-3 relative overflow-hidden group max-w-[calc(100vw-1.5rem)]">
        <div className="absolute inset-0 bg-primary-500/10 animate-pulse pointer-events-none"></div>
        
        <div className="text-lg sm:text-xl animate-bounce flex-shrink-0" style={{ animationDuration: '2s' }}>🔥</div>
        <div className="text-xs sm:text-sm font-medium min-w-0">
          <span className="font-bold text-primary-400">{count} businesses</span>
          <span className="hidden sm:inline"> optimized<br />their Google presence this week</span>
          <span className="sm:hidden"> optimized this week</span>
        </div>
        
        <button
          onClick={handleDismiss}
          className="ml-1 sm:ml-2 p-1 text-slate-500 hover:text-white transition-colors flex-shrink-0 tap-target"
          aria-label="Dismiss"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
