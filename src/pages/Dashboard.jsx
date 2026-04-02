import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-pale">
      <Navbar />

      <main className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl mx-auto space-y-8">
          <div className="animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <span className="text-2xl">🌿</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-dark mb-4">
              Dashboard Coming Soon
            </h1>
            <p className="text-lg sm:text-xl text-slate-700 font-body leading-relaxed">
              We're working hard to bring you powerful farming analytics and insights. 
              Backend integration is currently in progress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-12">
            <div className="card-hover text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-display font-semibold text-dark mb-2">Analytics</h3>
              <p className="text-sm text-slate-600">Real-time farming data and insights</p>
            </div>
            <div className="card-hover text-center">
              <div className="text-3xl mb-3">🌾</div>
              <h3 className="font-display font-semibold text-dark mb-2">Crop Health</h3>
              <p className="text-sm text-slate-600">Monitor and optimize crop performance</p>
            </div>
            <div className="card-hover text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-display font-semibold text-dark mb-2">Market Prices</h3>
              <p className="text-sm text-slate-600">Track real-time market trends</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="btn-primary focus-visible"
            >
              Go Back Home
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="btn-secondary focus-visible"
            >
              Check Status
            </button>
          </div>

          <div className="mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-600 font-body">
              <span className="font-semibold text-primary">Expected Launch:</span> Q2 2025
            </p>
            <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000"
                style={{ width: '65%' }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">Development Progress: 65%</p>
          </div>
        </div>
      </main>
    </div>
  )
}

