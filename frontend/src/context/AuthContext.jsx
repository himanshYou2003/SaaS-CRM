import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('crm_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('crm_token', data.data.token)
      localStorage.setItem('crm_user',  JSON.stringify(data.data.user))
      setUser(data.data.user)
      return data.data
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors 
        ? Object.values(err.response.data.errors)[0][0] 
        : 'Login failed'
      setError(msg)
      throw err;
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.post('/auth/register', payload)
      localStorage.setItem('crm_token', data.data.token)
      localStorage.setItem('crm_user',  JSON.stringify(data.data.user))
      setUser(data.data.user)
      return data.data
    } catch (err) {
      const msg = err.response?.data?.message || (err.response?.data?.errors 
        ? Object.values(err.response.data.errors)[0][0] 
        : 'Registration failed')
      setError(msg)
      throw err;
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout') } catch {}
    localStorage.removeItem('crm_token')
    localStorage.removeItem('crm_user')
    setUser(null)
  }, [])

  const hasPermission = useCallback((perm) => {
    if (!user) return false
    const perms = user.permissions ?? []
    return perms.includes('*') || perms.includes(perm)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
