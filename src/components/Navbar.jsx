import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import toast from 'react-hot-toast'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Pricing', href: '#pricing' }
]

export default function Navbar({ onOpenLogin, onOpenSignup }) {
  const { isLoggedIn, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully', {
      position: 'top-right',
      duration: 3000,
    })
    setMobileOpen(false)
  }

  const desktopNav = (
    <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
      {navLinks.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="text-sm font-body text-slate-700 hover:text-primary transition-colors duration-200 relative group"
        >
          {l.label}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
        </a>
      ))}
    </nav>
  )

  const mobileNav = (
    <nav
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
      aria-label="Mobile navigation"
    >
      <div className="px-4 pb-6 flex flex-col gap-4 pt-4">
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setMobileOpen(false)}
            className="text-base font-body text-slate-700 hover:text-primary transition-colors duration-200 py-2 border-b border-slate-100"
          >
            {l.label}
          </a>
        ))}

        {!isLoggedIn ? (
          <div className="flex flex-col gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                onOpenLogin?.()
              }}
              className="btn-outline text-base py-3 focus-visible"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                onOpenSignup?.()
              }}
              className="btn-primary text-base py-3 focus-visible"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-4">
            <RouterLink
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="btn-primary text-base py-3 text-center focus-visible"
            >
              Dashboard
            </RouterLink>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-outline text-base py-3 focus-visible"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )

  return (
    <header
      className={`sticky top-0 z-50 glass transition-all duration-300 ${
        scrolled ? 'shadow-medium border-b border-slate-200/50' : ''
      }`}
    >
      <div className="container h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RouterLink 
            to="/" 
            className="flex items-center gap-2 group"
            aria-label="AgriSmart home"
          >
            <span className="text-2xl leading-none animate-float">🍃</span>
            <span className="font-display font-bold text-primary text-xl tracking-tight group-hover:text-primary-light transition-colors duration-200">
              AgriSmart
            </span>
          </RouterLink>
        </div>

        {desktopNav}

        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => onOpenLogin?.()}
                className="btn-outline text-sm py-2 focus-visible"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => onOpenSignup?.()}
                className="btn-primary text-sm py-2 focus-visible"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <RouterLink
                to="/dashboard"
                className="btn-primary text-sm py-2 focus-visible"
              >
                Dashboard
              </RouterLink>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-outline text-sm py-2 focus-visible"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors duration-200 focus-visible"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileNav}
    </header>
  )
}

