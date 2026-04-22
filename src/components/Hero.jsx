import { useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function Hero({ onOpenSignup }) {
  const scrollToHowItWorks = useCallback(() => {
    const el = document.getElementById('how-it-works')
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <section className="mesh-bg min-h-screen flex items-center relative">
      <div className="container py-14 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 slide-in-up">
            <div className="badge-primary animate-fade-in">
              <span className="mr-2">🌿</span>
              AI-Powered Agriculture Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-dark leading-tight text-balance">
              Smarter Farming Starts with Data
            </h1>

            <p className="text-lg sm:text-xl text-slate-700 font-body leading-relaxed text-pretty max-w-lg">
              Get crop recommendations, price predictions, and weather insights — all
              in one intelligent platform designed for modern farmers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/smart-recommendations"
                className="btn-secondary text-lg py-4 text-center focus-visible"
              >
                Get Smart Recommendations
              </Link>
              <button
                type="button"
                onClick={onOpenSignup}
                className="btn-primary text-lg py-4 focus-visible shadow-strong"
              >
                Get Started
              </button>
              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="btn-secondary text-lg py-4 focus-visible"
              >
                View Demo
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-600 font-body animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Trusted by 10,000+ farmers across India</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>95% accuracy in predictions</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="agri-float bg-white rounded-3xl shadow-strong p-8 w-full max-w-md border border-slate-200/50">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-dark text-lg">Farm Dashboard</h3>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-bold text-primary">Live</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-primary-pale rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer">
                  <p className="text-2xl mb-1">☀️</p>
                  <p className="text-sm font-bold text-dark">32°C</p>
                  <p className="text-xs text-slate-600">Sunny</p>
                </div>
                <div className="bg-accent-pale rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer">
                  <p className="text-2xl mb-1">💧</p>
                  <p className="text-sm font-bold text-dark">68%</p>
                  <p className="text-xs text-slate-600">Humidity</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-slate-800">Wheat Health Score</p>
                    <span className="text-sm font-bold text-primary">87%</span>
                  </div>
                  <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000 ease-out"
                      style={{ width: '87%' }}
                      aria-label="Wheat score 87%"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-soil rounded-xl p-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Current Price</p>
                    <p className="text-lg font-bold text-dark">₹2,340/qt</p>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-bold bg-white px-3 py-1 rounded-full">
                    <span className="text-sm">↑</span>
                    <span className="text-sm">+4.2%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="badge-primary text-center w-full">
                  <span className="mr-2">🤖</span>
                  AI Tip: Best planting window is next 5 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

