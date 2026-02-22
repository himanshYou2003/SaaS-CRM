import { useEffect, useState } from 'react'
import api from '../api/client'
import { Plus, Phone, X, CheckCircle } from 'lucide-react'

function ContactModal({ contact, onClose, onSaved }) {
  const editing = !!contact?._id
  const [form, setForm] = useState({
    name: contact?.name ?? '', email: contact?.email ?? '', phone: contact?.phone ?? '',
    company: contact?.company ?? '', position: contact?.position ?? '', notes: contact?.notes ?? '',
  })
  const [err, setErr] = useState('')
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault(); setErr('')
    try {
      if (editing) { await api.put(`/contacts/${contact._id}`, form) }
      else         { await api.post('/contacts', form) }
      onSaved()
    } catch (err) { setErr(err.response?.data?.message ?? 'Failed to save.') }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{editing ? 'Edit Contact' : 'New Contact'}</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        {err && <div className="error-msg mb-4">{err}</div>}
        <form onSubmit={save}>
          <div className="form-group"><label>Name*</label>
            <input value={form.name} onChange={set('name')} required placeholder="John Smith" /></div>
          <div className="form-group"><label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="john@company.com" /></div>
          <div className="form-group"><label>Phone</label>
            <input value={form.phone} onChange={set('phone')} placeholder="+1 555 0000" /></div>
          <div className="form-group"><label>Company</label>
            <input value={form.company} onChange={set('company')} placeholder="Company name" /></div>
          <div className="form-group"><label>Position</label>
            <input value={form.position} onChange={set('position')} placeholder="CEO, VP Sales…" /></div>
          <div className="form-group"><label>Notes</label>
            <textarea value={form.notes} onChange={set('notes')} /></div>
          <div className="flex-gap" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><CheckCircle size={15} /> Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(null)

  const load = async () => {
    setLoading(true)
    try { const r = await api.get('/contacts'); setContacts(r.data.data.data ?? r.data.data) }
    catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const del = async (id) => {
    if (!confirm('Delete this contact?')) return
    await api.delete(`/contacts/${id}`); load()
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title"><Phone size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />Contacts</h1>
        <button className="btn btn-primary" onClick={() => setModal('new')}><Plus size={16} /> New Contact</button>
      </div>

      {loading ? <div className="loading-page"><span className="spinner" /></div> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Position</th><th></th></tr></thead>
            <tbody>
              {contacts.length > 0 ? contacts.map(c => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td className="text-muted">{c.email}</td>
                  <td className="text-muted">{c.phone}</td>
                  <td>{c.company}</td>
                  <td className="text-muted">{c.position}</td>
                  <td>
                    <div className="flex-gap">
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal(c)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(c._id)}>Del</button>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan={6} className="text-muted" style={{ padding: 24 }}>No contacts yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && <ContactModal contact={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />}
    </>
  )
}
