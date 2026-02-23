import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap } from 'lucide-react'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ company_name: '', name: '', email: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (form.password !== form.password_confirmation) { setError('Passwords do not match.'); return }
    try { await register(form); navigate('/') }
    catch (err) { setError(err.response?.data?.message || 'Registration failed.') }
  }

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center p-6 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-green/5 via-transparent to-transparent font-sans">
      <div className="w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white rounded-[24px] shadow-2xl shadow-brand-green/5 p-10 relative overflow-hidden">
          {/* Brand Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-brand-green/10 p-3 rounded-2xl mb-4">
              <Zap size={32} className="text-brand-green fill-current" />
            </div>
            <h1 className="text-3xl font-black text-brand-dark tracking-tight text-center">Create Workspace</h1>
            <p className="text-brand-slate font-medium text-sm mt-2 text-center px-4">Get started with the most powerful CRM for your team</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in shake duration-500">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <p className="text-sm font-semibold text-red-600 leading-none">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-widest pl-1">Company Identity</label>
              <input 
                placeholder="Acme Corp" 
                className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green/40 focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium"
                value={form.company_name} 
                onChange={set('company_name')} 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-slate uppercase tracking-widest pl-1">Admin Name</label>
                <input 
                  placeholder="John Smith" 
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green/40 focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium"
                  value={form.name} 
                  onChange={set('name')} 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-slate uppercase tracking-widest pl-1">Work Email</label>
                <input 
                  type="email" 
                  placeholder="admin@acme.com" 
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green/40 focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium"
                  value={form.email} 
                  onChange={set('email')} 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-slate uppercase tracking-widest pl-1">Security Key</label>
                <input 
                  type="password" 
                  placeholder="min. 8 chars" 
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green/40 focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium"
                  value={form.password} 
                  onChange={set('password')} 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-slate uppercase tracking-widest pl-1">Confirm Key</label>
                <input 
                  type="password" 
                  placeholder="repeat key" 
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green/40 focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium"
                  value={form.password_confirmation} 
                  onChange={set('password_confirmation')} 
                  required 
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                className="w-full bg-brand-green text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-brand-green/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                disabled={loading} 
                type="submit"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Workspace <Zap size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-brand-slate font-medium text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-green font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] font-bold text-brand-slate uppercase tracking-[4px] opacity-40">
          Trusted by 10,000+ Teams Worldwide
        </div>
      </div>
    </div>
  )
}
