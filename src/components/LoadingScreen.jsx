export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex flex-col items-center justify-center p-4 sm:p-6 text-white">

      {/* Animated Island Logo */}
      <div className="relative mb-8 sm:mb-10">
        <div className="absolute inset-0 rounded-full bg-white/10 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
          <div
            className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: 'white',
              borderRightColor: 'rgba(255,255,255,0.4)',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span className="text-3xl sm:text-4xl z-10">🍃</span>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-center px-4">Generating Your Profile Kit</h2>
      <p className="text-primary-200 text-center max-w-xs sm:max-w-sm mb-8 sm:mb-10 text-sm sm:text-lg px-4">
        Our AI is writing SEO-optimized content tailored to your PEI business…
      </p>

      {/* Animated steps checklist */}
      <div className="space-y-2 sm:space-y-3 w-full max-w-xs px-4">
        {[
          { label: "Analyzing your business details", delay: "0s" },
          { label: "Writing long & short descriptions", delay: "0.5s" },
          { label: "Crafting 5 Google Posts", delay: "1s" },
          { label: "Creating review response templates", delay: "1.5s" },
          { label: "Suggesting top categories", delay: "2s" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 opacity-0"
            style={{ animation: `fadeIn 0.5s ease-out ${item.delay} forwards` }}
          >
            <div
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white/60 flex-shrink-0"
              style={{
                borderTopColor: 'white',
                animation: `spin 1s linear infinite`,
                animationDelay: item.delay,
              }}
            />
            <span className="text-xs sm:text-sm text-white/90 font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-2 mt-8 sm:mt-10">
        <span className="text-primary-300 text-xs sm:text-sm mr-2">Powered by Gemini AI</span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
