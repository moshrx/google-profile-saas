import React from 'react';

export default function SocialSharePreview() {
  return (
    <div className="max-w-md mx-auto my-12">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Social Share Preview</h3>
      
      {/* Twitter / LinkedIn Style Preview Card */}
      <div className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer">
        {/* Mock Image Area */}
        <div className="w-full aspect-[1200/630] bg-slate-100 flex items-center justify-center relative overflow-hidden border-b border-slate-200">
          <img 
            src="/og-image.jpg" 
            alt="ListedPEI Social Preview" 
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback if image not found during dev */}
          <div className="absolute inset-0 hidden flex-col items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500 text-white p-6 text-center">
            <span className="font-black text-3xl tracking-tight mb-2">ListedPEI</span>
            <span className="font-medium text-sm text-white/80">Missing /og-image.jpg</span>
          </div>
        </div>
        
        {/* Meta Content Area */}
        <div className="p-4 bg-slate-50">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">listedpei.ca</p>
          <h4 className="font-bold text-slate-900 leading-tight mb-2 truncate">Free Google Business Profile Kits for PEI Small Businesses | ListedPEI</h4>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            Generate SEO-optimized Google Business Profile content in seconds. Free AI-powered tool built specifically for Prince Edward Island businesses.
          </p>
        </div>
      </div>
    </div>
  );
}
