import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem('agrismart_token')
    if (savedToken) {
      setToken(savedToken)
      setIsLoggedIn(true)
      // We only persist the token; user data will be populated on successful login.
      setUser(null)
    }
  }, [])

  const login = (userData, newToken) => {
    setUser(userData)
    setToken(newToken)
    setIsLoggedIn(true)
    localStorage.setItem('agrismart_token', newToken)
  }

  const logout = () => {
    localStorage.removeItem('agrismart_token')
    setUser(null)
    setToken(null)
    setIsLoggedIn(false)
  }

  const value = useMemo(
    () => ({ user, token, isLoggedIn, login, logout }),
    [user, token, isLoggedIn]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider

