export default function Logo({ className = "w-10 h-10", textClassName = "text-xl" }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className={`relative ${className} flex items-center justify-center`}>
        {/* Animated background rings */}
        <div className="absolute inset-0 bg-primary-500 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300 opacity-20"></div>
        <div className="absolute inset-0 bg-accent-500 rounded-xl -rotate-6 group-hover:-rotate-12 transition-transform duration-300 opacity-20"></div>

        {/* Main icon container */}
        <div className="relative w-full h-full bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
          {/* Google "G" shape made from arcs — signals Google Business */}
          <svg viewBox="0 0 24 24" fill="none" className="w-[62%] h-[62%]">
            {/* Outer ring */}
            <circle cx="12" cy="12" r="8" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="38 12" strokeLinecap="round" />
            {/* Center dot */}
            <circle cx="12" cy="12" r="2.5" fill="#fff" />
            {/* Right notch / pointer */}
            <path d="M20 12h-6" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <span className={`font-display font-black tracking-tight text-slate-900 ${textClassName}`}>
        Listed<span className="text-primary-600">PEI</span>
      </span>
    </div>
  );
}
