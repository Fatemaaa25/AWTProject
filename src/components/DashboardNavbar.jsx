import { useState } from 'react'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import toast from 'react-hot-toast'

export default function DashboardNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountModalOpen, setAccountModalOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
    setMobileOpen(false)
  }

  const openAccountModal = () => {
    setAccountModalOpen(true)
    setMobileOpen(false)
  }

  const closeAccountModal = () => {
    setAccountModalOpen(false)
  }

  const mobileNav = (
    <nav
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
      aria-label="Mobile navigation"
    >
      <div className="px-4 pb-6 flex flex-col gap-4 pt-4">
        <div className="flex items-center gap-3 py-3 border-b border-slate-200">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <div>
            <div className="font-medium text-slate-900">{user?.name || 'User'}</div>
            <div className="text-sm text-slate-600">{user?.email || 'user@example.com'}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={openAccountModal}
          className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors py-2"
        >
          <Settings size={18} />
          <span>Account Settings</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors py-2"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  )

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 group"
              aria-label="Dashboard home"
            >
              <span className="text-2xl leading-none">?</span>
              <span className="font-display font-bold text-primary text-xl tracking-tight">
                AgriSmart
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <div className="text-sm">
                <div className="font-medium text-slate-900">{user?.name || 'User'}</div>
                <div className="text-xs text-slate-600">{user?.email || 'user@example.com'}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={openAccountModal}
              className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
              title="Account Settings"
            >
              <Settings size={18} />
              <span className="hidden lg:inline">Account</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden lg:inline">Logout</span>
            </button>
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

      {/* Account Modal */}
      {accountModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeAccountModal}
          />
          
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Account Settings</h2>
                <button
                  type="button"
                  onClick={closeAccountModal}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Close account settings"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="text-center pb-6 border-b border-slate-200">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <User size={40} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{user?.name || 'User'}</h3>
                <p className="text-slate-600">{user?.email || 'user@example.com'}</p>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                    placeholder="Your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Account Type</label>
                  <div className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600">
                    Farmer Account
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Member Since</label>
                  <div className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600">
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  Edit Profile
                </button>
                
                <button
                  type="button"
                  className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Change Password
                </button>
                
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
