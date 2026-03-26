import React from 'react';

export default function LegalModal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col">
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-black text-slate-900">{title}</h2>
          <button 
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all tap-target"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 sm:p-8 overflow-y-auto text-slate-600 leading-relaxed space-y-4">
          {children}
        </div>
        <div className="px-4 sm:px-8 py-4 sm:py-6 bg-slate-50 text-right flex-shrink-0">
          <button 
            onClick={onClose}
            className="btn-primary text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
