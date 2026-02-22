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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{editing ? 'Edit Role' : 'New Role'}</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        {err && <div className="error-msg mb-4">{err}</div>}
        <form onSubmit={save}>
          <div className="form-group"><label>Role Name*</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required /></div>
          <div className="form-group"><label>Description</label>
            <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="form-group">
            <label>Permissions</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              {ALL_PERMISSIONS.map(p => (
                <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  color: 'var(--text)', fontSize: '0.85rem', fontWeight: 400 }}>
                  <input type="checkbox" checked={form.permissions.includes(p)} onChange={() => togglePerm(p)}
                    style={{ width: 'auto', accentColor: 'var(--accent)' }} />
                  {p}
                </label>
              ))}
            </div>
          </div>
          <div className="flex-gap" style={{ justifyContent: 'flex-end', marginTop: 12 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><CheckCircle size={15} /> Save</button>
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
    <>
      <div className="page-header">
        <h1 className="page-title"><ShieldCheck size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />Roles & Permissions</h1>
        <button className="btn btn-primary" onClick={() => setModal('new')}><Plus size={16} /> New Role</button>
      </div>

      {loading ? <div className="loading-page"><span className="spinner" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {roles.map(role => (
            <div key={role._id} className="card">
              <div className="flex-between mb-4">
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{role.name}</span>
                {role.name !== 'admin' && (
                  <div className="flex-gap">
                    <button className="btn btn-ghost btn-sm" onClick={() => setModal(role)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(role._id, role.name)}>Del</button>
                  </div>
                )}
              </div>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: 12 }}>{role.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(role.permissions ?? []).map(p => (
                  <span key={p} className="badge" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', fontSize: '0.7rem' }}>{p}</span>
                ))}
                {role.permissions?.includes('*') && (
                  <span className="badge badge-won">ALL PERMISSIONS</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <RoleModal role={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />}
    </>
  )
}
