// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../api/services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    getMe().then(r => setUser(r.data.user)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false))
  }, [])

  const login = (token, user) => { localStorage.setItem('token', token); setUser(user) }
  const logout = () => { localStorage.removeItem('token'); setUser(null) }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
