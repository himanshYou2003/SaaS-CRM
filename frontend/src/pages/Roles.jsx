import { useEffect, useState } from 'react'
import api from '../api/client'
import { Plus, ShieldCheck, X, CheckCircle } from 'lucide-react'

const ALL_PERMISSIONS = [
  'view_leads','create_lead','edit_lead','delete_lead','assign_lead',
  'view_contacts','create_contact','edit_contact','delete_contact',
  'view_deals','create_deal','edit_deal','delete_deal','update_deal_stage',
  'view_analytics',
  'manage_users','manage_roles',
]

function RoleModal({ role, onClose, onSaved }) {
  const editing = !!role?._id
  const [form, setForm] = useState({
    name: role?.name ?? '', description: role?.description ?? '',
    permissions: role?.permissions ?? [],
  })
  const [err, setErr] = useState('')

  const togglePerm = (p) => setForm(prev => ({
    ...prev,
    permissions: prev.permissions.includes(p)
      ? prev.permissions.filter(x => x !== p)
      : [...prev.permissions, p]
  }))

  const save = async (e) => {
    e.preventDefault(); setErr('')
    try {
      if (editing) { await api.put(`/roles/${role._id}`, form) }
      else         { await api.post('/roles', form) }
      onSaved()
    } catch (err) { setErr(err.response?.data?.message ?? 'Failed.') }
  }

  return (
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-bento shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-dark">{editing ? 'Edit Role' : 'New Role'}</h2>
          <button className="text-brand-slate hover:text-brand-dark transition-colors" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={save} className="p-8 space-y-6">
          {err && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">{err}</div>}
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Role Name</label>
              <input 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all placeholder:text-gray-400"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="e.g. Sales Manager" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Description</label>
              <input 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all placeholder:text-gray-400"
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Briefly describe responsibility" 
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Permissions Matrix</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              {ALL_PERMISSIONS.map(p => (
                <label key={p} className="flex items-center gap-2 group cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-brand-green focus:ring-brand-green/20 transition-all cursor-pointer"
                    checked={form.permissions.includes(p)} 
                    onChange={() => togglePerm(p)}
                  />
                  <span className="text-xs font-medium text-brand-slate group-hover:text-brand-dark transition-colors truncate">
                    {p.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-brand shadow-lg shadow-brand-green/20">
              <CheckCircle size={18} /> {editing ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Roles() {
  const [roles,   setRoles]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null)

  const load = async () => {
    setLoading(true)
    try { const r = await api.get('/roles'); setRoles(r.data.data) }
    catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const del = async (id, name) => {
    if (name === 'admin') { alert('Cannot delete admin role.'); return }
    if (!confirm('Delete this role?')) return
    await api.delete(`/roles/${id}`); load()
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark flex items-center gap-3">
            <ShieldCheck className="text-brand-green" size={28} /> Roles & Permissions
          </h1>
          <p className="text-brand-slate font-medium mt-1">Control access levels and system capabilities.</p>
        </div>
        <button className="btn-brand shadow-lg shadow-brand-green/20 py-2.5 px-6" onClick={() => setModal('new')}>
          <Plus size={18} /> New Role
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <div key={role._id} className="bento-card flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-brand-dark group-hover:text-brand-green transition-colors">{role.name}</h3>
                  <p className="text-sm text-brand-slate font-medium mt-1 leading-relaxed">{role.description || 'No description provided.'}</p>
                </div>
                {role.name !== 'admin' && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-brand-green/10 text-brand-slate hover:text-brand-green rounded-lg transition-colors" onClick={() => setModal(role)}>
                      <CheckCircle size={16} />
                    </button>
                    <button className="p-2 hover:bg-red-50 text-brand-slate hover:text-red-500 rounded-lg transition-colors" onClick={() => del(role._id, role.name)}>
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50">
                <div className="flex flex-wrap gap-2">
                  {role.permissions?.includes('*') ? (
                    <span className="px-2.5 py-1 bg-brand-green bg-opacity-10 text-brand-green text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Master Administrator
                    </span>
                  ) : (
                    (role.permissions ?? []).slice(0, 6).map(p => (
                      <span key={p} className="px-2 py-0.5 bg-gray-100 text-brand-slate text-[9px] font-bold rounded uppercase tracking-tighter">
                        {p.replace('_', ' ')}
                      </span>
                    ))
                  )}
                  {!role.permissions?.includes('*') && (role.permissions ?? []).length > 6 && (
                    <span className="px-2 py-0.5 bg-gray-50 text-brand-slate text-[9px] font-bold rounded uppercase tracking-tighter">
                      +{(role.permissions ?? []).length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <RoleModal 
          role={modal === 'new' ? null : modal} 
          onClose={() => setModal(null)} 
          onSaved={() => { setModal(null); load() }} 
        />
      )}
    </div>
  )
}
