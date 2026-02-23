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
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-bento shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-dark">{editing ? 'Edit Contact' : 'New Contact'}</h2>
          <button className="text-brand-slate hover:text-brand-dark transition-colors" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={save} className="p-8 space-y-5">
          {err && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">{err}</div>}
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Full Name</label>
            <input 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all"
              value={form.name} onChange={set('name')} required placeholder="e.g. John Smith" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Email</label>
              <input 
                type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all"
                value={form.email} onChange={set('email')} placeholder="john@company.com" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Phone</label>
              <input 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all"
                value={form.phone} onChange={set('phone')} placeholder="+91 00000 00000" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Company</label>
              <input 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all"
                value={form.company} onChange={set('company')} placeholder="Company Name" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Position</label>
              <input 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all"
                value={form.position} onChange={set('position')} placeholder="CEO, Manager, etc." 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Notes</label>
            <textarea 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all min-h-[80px] resize-none"
              value={form.notes} onChange={set('notes')} placeholder="Add any specific details about this person..." 
            />
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-brand shadow-lg shadow-brand-green/20">
              <CheckCircle size={18} /> {editing ? 'Update Contact' : 'Create Contact'}
            </button>
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
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark flex items-center gap-3">
            <Phone className="text-brand-green" size={28} /> Contacts
          </h1>
          <p className="text-brand-slate font-medium mt-1">Your network of business partners and stakeholders.</p>
        </div>
        <button className="btn-brand shadow-lg shadow-brand-green/20 py-2.5 px-6" onClick={() => setModal('new')}>
          <Plus size={18} /> New Contact
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
        </div>
      ) : (
        <div className="bento-card overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider">Contact</th>
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider">Phone / Email</th>
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider text-center">Company</th>
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {contacts.length > 0 ? contacts.map(c => (
                  <tr key={c._id} className="group hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-brand-dark group-hover:text-brand-green transition-colors">{c.name}</div>
                          <div className="text-xs text-brand-slate font-medium">{c.position || 'No Position'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-medium text-brand-dark text-sm">{c.email}</div>
                      <div className="text-xs text-brand-slate mt-0.5">{c.phone || 'No phone'}</div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1 bg-gray-100 text-brand-slate text-[10px] font-bold rounded uppercase tracking-wider">
                        {c.company || 'Personal'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-brand-green/10 text-brand-slate hover:text-brand-green rounded-lg transition-colors" onClick={() => setModal(c)}>
                          <CheckCircle size={18} />
                        </button>
                        <button className="p-2 hover:bg-red-50 text-brand-slate hover:text-red-500 rounded-lg transition-colors" onClick={() => del(c._id)}>
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-brand-slate font-medium">
                      No contacts found. Start building your professional network.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <ContactModal 
          contact={modal === 'new' ? null : modal} 
          onClose={() => setModal(null)} 
          onSaved={() => { setModal(null); load() }} 
        />
      )}
    </div>
  )
}
