import { useEffect, useState } from 'react'
import api from '../api/client'
import { Plus, Briefcase, X, CheckCircle } from 'lucide-react'

const STAGES = ['prospecting','qualification','proposal','negotiation','closed_won','closed_lost']
const STAGE_COLORS = {
  prospecting:  'text-blue-600 bg-blue-50 border-blue-100',
  qualification: 'text-cyan-600 bg-cyan-50 border-cyan-100',
  proposal: 'text-amber-600 bg-amber-50 border-amber-100',
  negotiation:  'text-purple-600 bg-purple-50 border-purple-100',
  closed_won:    'text-brand-green bg-brand-green/10 border-brand-green/20',
  closed_lost: 'text-red-500 bg-red-50 border-red-100'
}

function DealModal({ deal, onClose, onSaved }) {
  const editing = !!deal?._id
  const [form, setForm] = useState({
    title: deal?.title ?? '', stage: deal?.stage ?? 'prospecting',
    amount: deal?.amount ?? '', probability: deal?.probability ?? 0, notes: deal?.notes ?? '',
  })
  const [err, setErr] = useState('')
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault(); setErr('')
    try {
      const payload = { ...form, amount: parseFloat(form.amount)||0, probability: parseInt(form.probability)||0 }
      if (editing) { await api.put(`/deals/${deal._id}`, payload) }
      else         { await api.post('/deals', payload) }
      onSaved()
    } catch (err) { setErr(err.response?.data?.message ?? 'Failed to save.') }
  }

  return (
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-bento shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-dark">{editing ? 'Edit Deal' : 'New Deal'}</h2>
          <button className="text-brand-slate hover:text-brand-dark transition-colors" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={save} className="p-8 space-y-5">
          {err && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">{err}</div>}
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Deal Title</label>
            <input 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all placeholder:text-gray-400"
              value={form.title} onChange={set('title')} required placeholder="e.g. Q4 Cloud Services" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Stage</label>
              <select 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all appearance-none"
                value={form.stage} onChange={set('stage')}
              >
                {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Amount (INR)</label>
              <input 
                type="number" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all"
                value={form.amount} onChange={set('amount')} placeholder="0" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Probability (%)</label>
            <input 
              type="range" className="w-full accent-brand-green"
              min="0" max="100" step="5" value={form.probability} onChange={set('probability')} 
            />
            <div className="flex justify-between text-[10px] font-bold text-brand-slate">
              <span>0% (Lead)</span>
              <span>{form.probability}% (Current)</span>
              <span>100% (Won)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">Notes</label>
            <textarea 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all min-h-[80px] resize-none"
              value={form.notes} onChange={set('notes')} placeholder="Add deal progress notes..." 
            />
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-brand shadow-lg shadow-brand-green/20">
              <CheckCircle size={18} /> {editing ? 'Update Deal' : 'Start Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function KanbanCard({ deal, onEdit, onStageChange }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-brand-dark text-sm leading-tight group-hover:text-brand-green transition-colors">{deal.title}</h4>
      </div>
      
      <div className="flex items-end justify-between mt-4">
        <div>
          <div className="text-brand-green font-bold text-sm">
            {deal.amount > 0 ? `$${deal.amount.toLocaleString()}` : '--'}
          </div>
          <div className="text-[10px] font-bold text-brand-slate uppercase tracking-tighter mt-0.5">
             {deal.probability}% Prob.
          </div>
        </div>
        <div className="flex gap-1">
          <button 
            className="p-1.5 text-brand-slate hover:text-brand-green hover:bg-brand-green/10 rounded-lg transition-colors"
            onClick={() => onEdit(deal)}
          >
            <CheckCircle size={14} />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-50">
        <select 
          value={deal.stage} 
          onChange={e => onStageChange(deal._id, e.target.value)}
          className="w-full bg-gray-50 border-none text-[10px] font-bold uppercase tracking-wider p-1.5 rounded outline-none text-brand-slate cursor-pointer hover:bg-gray-100"
        >
          {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>
    </div>
  )
}

export default function Deals() {
  const [board,   setBoard]   = useState({})
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const r = await api.get('/deals?kanban=true')
      setBoard(r.data.data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const stageChange = async (dealId, stage) => {
    await api.post(`/deals/${dealId}/stage`, { stage }); load()
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark flex items-center gap-3">
            <Briefcase className="text-brand-green" size={28} /> Pipeline
          </h1>
          <p className="text-brand-slate font-medium mt-1">Visualize your sales flow and revenue projections.</p>
        </div>
        <button className="btn-brand shadow-lg shadow-brand-green/20 py-2.5 px-6" onClick={() => setModal('new')}>
          <Plus size={18} /> New Deal
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6 pb-8">
          {STAGES.map(stage => (
            <div key={stage} className="flex flex-col gap-4 min-w-0">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${STAGE_COLORS[stage].split(' ')[0]}`} />
                  <h3 className="text-[10px] font-black uppercase tracking-[2px] text-brand-dark">
                    {stage.replace('_', ' ')}
                  </h3>
                </div>
                <span className="text-[10px] font-black bg-gray-100 text-brand-slate px-2 py-0.5 rounded-full">
                  {(board[stage] ?? []).length}
                </span>
              </div>
              
              <div className="bg-gray-50/50 rounded-2xl p-3 min-h-[400px] border border-gray-100/50 flex flex-col gap-3 transition-colors hover:bg-gray-100/30">
                {(board[stage] ?? []).map((deal, i) => (
                  <KanbanCard 
                    key={deal._id || deal.id || i} deal={deal}
                    onEdit={setModal}
                    onStageChange={stageChange} 
                  />
                ))}
                {(board[stage] ?? []).length === 0 && (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl flex-1 flex items-center justify-center text-[10px] font-bold text-brand-slate uppercase text-center p-6 opacity-50">
                    No active deals
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <DealModal 
          deal={modal === 'new' ? null : modal} 
          onClose={() => setModal(null)} 
          onSaved={() => { setModal(null); load() }} 
        />
      )}
    </div>
  )
}
