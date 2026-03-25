import React from 'react';

export default function Logo({ className = "w-10 h-10", textClassName = "text-xl" }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className={`relative ${className} flex items-center justify-center`}>
        {/* Animated background rings */}
        <div className="absolute inset-0 bg-primary-500 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300 opacity-20"></div>
        <div className="absolute inset-0 bg-accent-500 rounded-xl -rotate-6 group-hover:-rotate-12 transition-transform duration-300 opacity-20"></div>
        
        {/* Main Icon Container */}
        <div className="relative w-full h-full bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-2/3 h-2/3 text-white"
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
      </div>
      
      <span className={`font-display font-black tracking-tight text-slate-900 ${textClassName}`}>
        Listed<span className="text-primary-600">PEI</span>
      </span>
    </div>
  );
}
