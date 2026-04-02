export default function CTASection({ onOpenSignup }) {
  const patternDataUri = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <circle cx="12" cy="18" r="2" fill="#E8F5E9" opacity="0.6"/>
      <circle cx="44" cy="40" r="2" fill="#FF8F00" opacity="0.35"/>
      <path d="M42 14c-10 6-10 18 0 24 10-6 10-18 0-24Z" fill="#E8F5E9" opacity="0.25"/>
      <path d="M18 46c8-4 12-12 10-20-8 4-12 12-10 20Z" fill="#E8F5E9" opacity="0.18"/>
      <circle cx="28" cy="28" r="1.5" fill="#E8F5E9" opacity="0.55"/>
    </svg>
  `).replace(/'/g, '%27').replace(/"/g, '%22')

  return (
    <section id="pricing" className="bg-primary text-white py-16 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,${patternDataUri}")`
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl">
            Start Making Smarter Farming Decisions Today
          </h2>
          <p className="mt-4 text-white/90 text-lg font-body">
            Join 10,000+ farmers already using AgriSmart to grow more and earn more.
          </p>

          <button
            type="button"
            onClick={onOpenSignup}
            className="mt-8 inline-flex items-center justify-center bg-white text-primary font-bold rounded-full px-8 py-4 hover:bg-soil transition hover:scale-[1.02]"
          >
            Try AgriSmart Free <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}

