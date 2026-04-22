import { useEffect, useState } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerUser } from '../../services/api.js'
import { useAuth } from '../../hooks/useAuth.js'

const roles = ['Farmer', 'Agronomist', 'Researcher']

export default function SignupModal({ isOpen, onClose, onOpenLogin }) {
  const { login } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState(roles[0])
  const [agreeTerms, setAgreeTerms] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setFullName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
    setRole(roles[0])
    setAgreeTerms(false)
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (!agreeTerms) {
      toast.error('Please agree to the Terms & Conditions')
      return
    }

    try {
      const res = await registerUser({
        name: fullName,
        email,
        password,
        role
      })
      const data = res?.data || {}
      toast.success('Account created successfully!')
      // If backend returns token, log in right away; otherwise mock.
      if (data?.token) {
        login(data.user || { name: fullName, email }, data.token)
      }
      onClose?.()
    } catch (err) {
      console.error('Registration error:', err)
      const errorMessage = err?.response?.data?.error || err?.message || 'Registration failed. Please try again.'
      toast.error(errorMessage)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full modal-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X size={18} className="mx-auto" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-2xl">🍃</span>
          <h2 className="font-display font-extrabold text-xl text-dark">
            Create Your AgriSmart Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 font-body">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 font-body">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 font-body">
                Password
              </label>
              <div className="mt-2 relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full rounded-xl border border-slate-200 p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full hover:bg-slate-100 transition flex items-center justify-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 font-body">
                Confirm Password
              </label>
              <div className="mt-2 relative">
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="w-full rounded-xl border border-slate-200 p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full hover:bg-slate-100 transition flex items-center justify-center"
                  aria-label={
                    showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-700 font-body">
                Role
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {roles.map((r) => {
                  const active = role === r
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-4 py-2 rounded-full border text-sm font-bold transition ${
                        active
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-primary-pale'
                      }`}
                    >
                      {r}
                    </button>
                  )
                })}
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm font-body text-slate-700">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 accent-primary"
              />
              <span>
                I agree to the Terms &amp; Conditions and Privacy Policy
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-primary text-white font-bold rounded-xl px-4 py-3 hover:brightness-110 transition"
          >
            Create Account
          </button>

          <button
            type="button"
            onClick={() => {
              onClose?.()
              onOpenLogin?.()
            }}
            className="mt-4 w-full text-center text-sm font-bold text-slate-700 hover:text-primary transition"
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  )
}

