import { useEffect, useState } from 'react'
import api from '../api/client'
import { Plus, X, CheckCircle, Users } from 'lucide-react'

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost']

function LeadBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>
}

function LeadModal({ lead, onClose, onSaved }) {
  const editing = !!lead?._id
  const [form, setForm] = useState({
    title: lead?.title ?? '', status: lead?.status ?? 'new',
    value: lead?.value ?? '', notes: lead?.notes ?? '', tags: lead?.tags?.join(', ') ?? '',
  })
  const [err, setErr] = useState('')
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault(); setErr('')
    try {
      const payload = { ...form, value: parseFloat(form.value) || 0,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] }
      if (editing) { await api.put(`/leads/${lead._id}`, payload) }
      else         { await api.post('/leads', payload) }
      onSaved()
    } catch (err) { setErr(err.response?.data?.message ?? 'Failed to save.') }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{editing ? 'Edit Lead' : 'New Lead'}</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        {err && <div className="error-msg mb-4">{err}</div>}
        <form onSubmit={save}>
          <div className="form-group"><label>Title*</label>
            <input value={form.title} onChange={set('title')} required placeholder="Lead title" /></div>
          <div className="form-group"><label>Status</label>
            <select value={form.status} onChange={set('status')}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select></div>
          <div className="form-group"><label>Value ($)</label>
            <input type="number" min="0" value={form.value} onChange={set('value')} placeholder="0" /></div>
          <div className="form-group"><label>Tags (comma-separated)</label>
            <input value={form.tags} onChange={set('tags')} placeholder="enterprise, priority" /></div>
          <div className="form-group"><label>Notes</label>
            <textarea value={form.notes} onChange={set('notes')} placeholder="Additional notes…" /></div>
          <div className="flex-gap" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><CheckCircle size={15} /> Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Leads() {
  const [leads,   setLeads]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null) // null | 'new' | lead object

  const load = async () => {
    setLoading(true)
    try { const r = await api.get('/leads'); setLeads(r.data.data.data ?? r.data.data) }
    catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const del = async (id) => {
    if (!confirm('Delete this lead?')) return
    await api.delete(`/leads/${id}`)
    load()
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title"><Users size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />Leads</h1>
        <button className="btn btn-primary" onClick={() => setModal('new')}>
          <Plus size={16} /> New Lead
        </button>
      </div>

      {loading ? <div className="loading-page"><span className="spinner" /></div> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Title</th><th>Status</th><th>Value</th><th>Tags</th><th>Created</th><th></th></tr>
            </thead>
            <tbody>
              {leads.length > 0 ? leads.map(l => (
                <tr key={l._id}>
                  <td style={{ fontWeight: 600 }}>{l.title}</td>
                  <td><LeadBadge status={l.status} /></td>
                  <td style={{ color: 'var(--success)' }}>${(l.value ?? 0).toLocaleString()}</td>
                  <td>{l.tags?.map(t => <span key={t} className="badge" style={{ marginRight: 4, background: 'var(--surface-2)', color: 'var(--text-muted)' }}>{t}</span>)}</td>
                  <td className="text-muted">{new Date(l.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex-gap">
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal(l)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(l._id)}>Del</button>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan={6} className="text-muted" style={{ padding: 24 }}>No leads yet. Create your first lead!</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <LeadModal
          lead={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </>
  )
}
