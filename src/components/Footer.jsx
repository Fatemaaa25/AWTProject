import { GitFork, Network, Play, X, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const linkClass = 'text-white/80 hover:text-primary-light transition-colors text-sm py-1'

  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍃</span>
              <span className="font-display font-bold text-primary text-lg">AgriSmart</span>
            </div>
            <p className="text-white/80 font-body leading-relaxed">
              Empowering farmers with the power of data and AI to make smarter decisions and increase yields.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Mail size={14} />
                <span>support@agrismart.com</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Phone size={14} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin size={14} />
                <span>Bengaluru, India</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-4">Product</h3>
            <div className="flex flex-col gap-2">
              <a href="#features" className={linkClass}>
                Features
              </a>
              <a href="#how-it-works" className={linkClass}>
                How It Works
              </a>
              <a href="#pricing" className={linkClass}>
                Pricing
              </a>
              <a href="#demo" className={linkClass}>
                Demo
              </a>
              <a href="#api" className={linkClass}>
                API Access
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-4">Company</h3>
            <div className="flex flex-col gap-2">
              <a href="#about" className={linkClass}>
                About Us
              </a>
              <a href="#blog" className={linkClass}>
                Blog
              </a>
              <a href="#careers" className={linkClass}>
                Careers
              </a>
              <a href="#contact" className={linkClass}>
                Contact
              </a>
              <a href="#partners" className={linkClass}>
                Partners
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-4">Connect</h3>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary-light transition-all duration-200 hover:scale-110"
                aria-label="Twitter"
              >
                <X size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary-light transition-all duration-200 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Network size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary-light transition-all duration-200 hover:scale-110"
                aria-label="YouTube"
              >
                <Play size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary-light transition-all duration-200 hover:scale-110"
                aria-label="GitHub"
              >
                <GitFork size={18} />
              </a>
            </div>
            <div className="bg-primary/10 rounded-xl p-4">
              <h4 className="font-display font-semibold text-sm mb-2">Newsletter</h4>
              <p className="text-white/70 text-xs mb-3">
                Get the latest farming insights and updates
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-primary/50"
                />
                <button className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left text-sm text-white/60">
              © 2025 AgriSmart. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <a href="#privacy" className="text-white/60 hover:text-primary-light transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-white/60 hover:text-primary-light transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="text-white/60 hover:text-primary-light transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

