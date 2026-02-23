import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-green/5 via-transparent to-transparent font-sans">
      <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white rounded-[24px] shadow-2xl shadow-brand-green/5 p-10 relative overflow-hidden">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-brand-green/10 p-3 rounded-2xl mb-4">
              <Zap size={32} className="text-brand-green fill-current" />
            </div>
            <h1 className="text-3xl font-black text-brand-dark tracking-tight">Welcome Back</h1>
            <p className="text-brand-slate font-medium text-sm mt-2">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in shake duration-500">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <p className="text-sm font-semibold text-red-600 leading-none">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-widest pl-1">Email Address</label>
              <input 
                type="email" 
                placeholder="you@company.com" 
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green/40 focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-widest pl-1">Secret Key</label>
              <div className="relative group">
                <input 
                  type={showPwd ? 'text' : 'password'} 
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green/40 focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPwd(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-slate hover:text-brand-green transition-colors p-1"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              className="w-full bg-brand-green text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-brand-green/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              disabled={loading} 
              type="submit"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <Zap size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-brand-slate font-medium text-sm">
              New to the platform?{' '}
              <Link to="/register" className="text-brand-green font-bold hover:underline">
                Register Company
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] font-bold text-brand-slate uppercase tracking-[4px] opacity-40">
          Crafted by himanshu
        </div>
      </div>
    </div>
  )
}
