import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import ProblemSection from '../components/ProblemSection.jsx'
import SolutionSection from '../components/SolutionSection.jsx'
import FeaturesSection from '../components/FeaturesSection.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import BenefitsSection from '../components/BenefitsSection.jsx'
import CTASection from '../components/CTASection.jsx'
import Footer from '../components/Footer.jsx'
import LoginModal from '../components/auth/LoginModal.jsx'
import SignupModal from '../components/auth/SignupModal.jsx'

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  const openLogin = () => {
    setIsLoginOpen(true)
    setIsSignupOpen(false)
  }

  const openSignup = () => {
    setIsSignupOpen(true)
    setIsLoginOpen(false)
  }

  return (
    <div>
      <Navbar onOpenLogin={openLogin} onOpenSignup={openSignup} />
      <Hero onOpenSignup={openSignup} />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorks />
      <BenefitsSection />
      <CTASection onOpenSignup={openSignup} />
      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenSignup={openSignup}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onOpenLogin={openLogin}
      />
    </div>
  )
}

