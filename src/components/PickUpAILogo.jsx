export default function PickUpAILogo({ className = "w-10 h-10", textClassName = "text-xl", light = false }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className={`relative ${className} flex items-center justify-center`}>
        {/* Glow rings */}
        <div className="absolute inset-0 bg-[#C34A36] rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300 opacity-25"></div>
        <div className="absolute inset-0 bg-primary-500 rounded-xl -rotate-6 group-hover:-rotate-12 transition-transform duration-300 opacity-20"></div>

        {/* Main icon */}
        <div className="relative w-full h-full bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
          {/* Phone handset */}
          <svg viewBox="0 0 24 24" fill="none" className="w-[58%] h-[58%]" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.92-8.72A2 2 0 0 1 3.11 2h3a2 2 0 0 1 2 1.72c.12.9.35 1.78.68 2.61a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.83.33 1.71.56 2.61.68A2 2 0 0 1 22 16.92z" />
          </svg>
          {/* AI dot */}
          <span className="absolute top-[18%] right-[18%] flex h-2 w-2 items-center justify-center rounded-full bg-[#C34A36]">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#C34A36] opacity-60 group-hover:animate-ping"></span>
          </span>
        </div>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-display font-black tracking-tight ${light ? 'text-white' : 'text-slate-900'} ${textClassName}`}>
          PickUp<span className="text-[#C34A36]">AI</span>
        </span>
        <span className={`text-[0.6em] font-bold tracking-[0.18em] uppercase ${light ? 'text-slate-400' : 'text-slate-400'}`}>by ListedPEI</span>
      </div>
    </div>
  );
}
