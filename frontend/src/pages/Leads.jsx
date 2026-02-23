import { useEffect, useState } from 'react'
import api from '../api/client'
import { Plus, X, CheckCircle, Users } from 'lucide-react'

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost']

function LeadBadge({ status }) {
  const styles = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-cyan-100 text-cyan-700',
    qualified: 'bg-brand-lime text-brand-green',
    proposal: 'bg-amber-100 text-amber-700',
    negotiation: 'bg-purple-100 text-purple-700',
    won: 'bg-brand-green bg-opacity-10 text-brand-green',
    lost: 'bg-red-100 text-red-700',
  }
  return <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${styles[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
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
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-bento shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-dark">{editing ? 'Edit Lead' : 'New Lead'}</h2>
          <button className="text-brand-slate hover:text-brand-dark transition-colors" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={save} className="p-8 space-y-5">
          {err && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">{err}</div>}
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Lead Title</label>
            <input 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all placeholder:text-gray-400"
              value={form.title} onChange={set('title')} required placeholder="e.g. Enterprise License Renewal" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Status</label>
              <select 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all appearance-none"
                value={form.status} onChange={set('status')}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Value (INR)</label>
              <input 
                type="number" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all"
                value={form.value} onChange={set('value')} placeholder="0" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Tags</label>
            <input 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all placeholder:text-gray-400"
              value={form.tags} onChange={set('tags')} placeholder="priority, enterprise, tech" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Notes</label>
            <textarea 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all min-h-[100px] resize-none"
              value={form.notes} onChange={set('notes')} placeholder="Describe the current state of the lead..." 
            />
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-brand shadow-lg shadow-brand-green/20">
              <CheckCircle size={18} /> {editing ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Leads() {
  const [leads,   setLeads]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null)

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
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark flex items-center gap-3">
            <Users className="text-brand-green" size={28} /> Leads
          </h1>
          <p className="text-brand-slate font-medium mt-1">Manage and track your potential customers.</p>
        </div>
        <button className="btn-brand shadow-lg shadow-brand-green/20 py-2.5 px-6" onClick={() => setModal('new')}>
          <Plus size={18} /> New Lead
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
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider">Title</th>
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider text-center">Status</th>
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider">Expected Value</th>
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider">Created</th>
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.length > 0 ? leads.map(l => (
                  <tr key={l._id} className="group hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-brand-dark group-hover:text-brand-green transition-colors">{l.title}</div>
                      <div className="flex gap-1.5 mt-1.5">
                        {l.tags?.map(t => (
                          <span key={t} className="text-[10px] font-bold text-brand-slate bg-gray-100 px-2 py-0.5 rounded uppercase tracking-tighter">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center"><LeadBadge status={l.status} /></td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-brand-green">${(l.value ?? 0).toLocaleString()}</div>
                      <div className="text-[10px] text-brand-slate font-bold uppercase tracking-tight">Projected Revenue</div>
                    </td>
                    <td className="px-8 py-5 font-medium text-brand-slate text-sm">
                      {new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-brand-green/10 text-brand-slate hover:text-brand-green rounded-lg transition-colors" onClick={() => setModal(l)}>
                          <CheckCircle size={18} />
                        </button>
                        <button className="p-2 hover:bg-red-50 text-brand-slate hover:text-red-500 rounded-lg transition-colors" onClick={() => del(l._id)}>
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-brand-slate font-medium">
                      No leads found. Create your first business opportunity today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}

