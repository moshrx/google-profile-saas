import React, { useState, useEffect } from 'react';

export default function FloatingBadge() {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage for existing count and expiry
    const storedCount = localStorage.getItem('listedpei_badge_count');
    const storedExpiry = localStorage.getItem('listedpei_badge_expiry');
    const now = new Date().getTime();

    let finalCount;

    if (storedCount && storedExpiry && now < parseInt(storedExpiry, 10)) {
      finalCount = parseInt(storedCount, 10);
    } else {
      // Generate random number between 12-28
      finalCount = Math.floor(Math.random() * (28 - 12 + 1)) + 12;
      localStorage.setItem('listedpei_badge_count', finalCount.toString());
      // Set expiry to 7 days from now
      localStorage.setItem('listedpei_badge_expiry', (now + 7 * 24 * 60 * 60 * 1000).toString());
    }

    setCount(finalCount);

    // Initial fade in delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up pointer-events-none">
      <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-800 flex items-center gap-3 relative overflow-hidden group">
        {/* Pulsing glow background */}
        <div className="absolute inset-0 bg-primary-500/10 animate-pulse pointer-events-none"></div>
        
        <div className="text-xl animate-bounce" style={{ animationDuration: '2s' }}>🔥</div>
        <div className="text-sm font-medium">
          <span className="font-bold text-primary-400">{count} businesses</span> optimized<br />their Google presence this week
        </div>
      </div>
    </div>
  );
}
