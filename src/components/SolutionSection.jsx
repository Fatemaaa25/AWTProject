export default function SolutionSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <p className="text-primary font-bold">The Solution</p>
            <h2 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-dark">
              AgriSmart Brings It All Together
            </h2>
            <p className="mt-4 text-slate-700 text-lg font-body">
              AgriSmart combines real-time weather data, soil health insights, and live
              market trends — powered by AI — so farmers can make confident decisions
              every single day.
            </p>

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
              <div className="inline-flex items-center gap-2 bg-primary-pale rounded-full px-4 py-2 font-bold text-primary">
                <span>🌦️</span> Weather API
              </div>
              <div className="inline-flex items-center gap-2 bg-primary-pale rounded-full px-4 py-2 font-bold text-primary">
                <span>🧪</span> Soil Insights
              </div>
              <div className="inline-flex items-center gap-2 bg-primary-pale rounded-full px-4 py-2 font-bold text-primary">
                <span>📈</span> Market Data
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <svg
              width="420"
              height="320"
              viewBox="0 0 420 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-[420px] h-auto"
              aria-hidden="true"
            >
              <path
                d="M62 220C110 180 140 95 210 105C270 113 300 190 355 195"
                stroke="#4CAF50"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d="M80 85C120 95 145 135 190 140C240 146 270 120 320 95"
                stroke="#FF8F00"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M120 255C160 235 205 240 250 255C285 267 312 262 350 240"
                stroke="#4CAF50"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.7"
                strokeDasharray="6 8"
              />

              {[
                { cx: 62, cy: 220, c: '#2E7D32' },
                { cx: 210, cy: 105, c: '#2E7D32' },
                { cx: 355, cy: 195, c: '#4CAF50' },
                { cx: 80, cy: 85, c: '#FF8F00' },
                { cx: 320, cy: 95, c: '#FF8F00' },
                { cx: 190, cy: 140, c: '#2E7D32' },
                { cx: 250, cy: 255, c: '#4CAF50' }
              ].map((n, idx) => (
                <g key={idx}>
                  <circle cx={n.cx} cy={n.cy} r="18" fill={n.c} opacity="0.15" />
                  <circle cx={n.cx} cy={n.cy} r="8" fill={n.c} />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

