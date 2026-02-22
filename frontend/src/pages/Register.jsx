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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1><Zap size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />SaaS CRM</h1>
          <p>Create your company workspace</p>
        </div>
        {error && <div className="error-msg mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Company Name</label>
            <input placeholder="Acme Corp" value={form.company_name} onChange={set('company_name')} required /></div>
          <div className="form-group"><label>Your Name</label>
            <input placeholder="John Smith" value={form.name} onChange={set('name')} required /></div>
          <div className="form-group"><label>Email</label>
            <input type="email" placeholder="admin@acme.com" value={form.email} onChange={set('email')} required /></div>
          <div className="form-group"><label>Password</label>
            <input type="password" placeholder="min. 8 characters" value={form.password} onChange={set('password')} required /></div>
          <div className="form-group"><label>Confirm Password</label>
            <input type="password" placeholder="repeat password" value={form.password_confirmation} onChange={set('password_confirmation')} required /></div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading} type="submit">
            {loading ? <span className="spinner" /> : 'Create Workspace'}
          </button>
        </form>
        <div className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  )
}
