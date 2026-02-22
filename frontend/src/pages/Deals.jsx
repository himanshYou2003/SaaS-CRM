import { useEffect, useState } from 'react'
import api from '../api/client'
import { Plus, Briefcase, X, CheckCircle } from 'lucide-react'

const STAGES = ['prospecting','qualification','proposal','negotiation','closed_won','closed_lost']
const STAGE_COLORS = {
  prospecting:  '#6c63ff', qualification: '#4ecdc4', proposal: '#f59e0b',
  negotiation:  '#a78bfa', closed_won:    '#22c55e',  closed_lost: '#ef4444'
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{editing ? 'Edit Deal' : 'New Deal'}</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        {err && <div className="error-msg mb-4">{err}</div>}
        <form onSubmit={save}>
          <div className="form-group"><label>Title*</label>
            <input value={form.title} onChange={set('title')} required /></div>
          <div className="form-group"><label>Stage</label>
            <select value={form.stage} onChange={set('stage')}>
              {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select></div>
          <div className="form-group"><label>Amount ($)</label>
            <input type="number" min="0" value={form.amount} onChange={set('amount')} /></div>
          <div className="form-group"><label>Probability (%)</label>
            <input type="number" min="0" max="100" value={form.probability} onChange={set('probability')} /></div>
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

function KanbanCard({ deal, onEdit, onStageChange }) {
  return (
    <div className="kanban-card">
      <div className="kanban-card-title">{deal.title}</div>
      {deal.amount > 0 && <div className="kanban-card-amount">${deal.amount.toLocaleString()}</div>}
      {deal.probability > 0 && <div className="kanban-card-assign">{deal.probability}% probability</div>}
      <div className="flex-gap" style={{ marginTop: 10 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(deal)}>Edit</button>
        <select value={deal.stage} onChange={e => onStageChange(deal._id, e.target.value)}
          style={{ flex: 1, fontSize: '0.75rem', padding: '4px 8px' }}>
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
    <>
      <div className="page-header">
        <h1 className="page-title"><Briefcase size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />Deals Pipeline</h1>
        <button className="btn btn-primary" onClick={() => setModal('new')}><Plus size={16} /> New Deal</button>
      </div>

      {loading ? <div className="loading-page"><span className="spinner" /></div> : (
        <div className="kanban-board">
          {STAGES.map(stage => (
            <div key={stage} className="kanban-column">
              <div className="kanban-column-header">
                <span style={{ color: STAGE_COLORS[stage] }}>{stage.replace('_', ' ').toUpperCase()}</span>
                <span style={{ background: 'var(--surface-2)', color: 'var(--text-muted)',
                  borderRadius: 20, padding: '2px 8px', fontSize: '0.75rem' }}>
                  {(board[stage] ?? []).length}
                </span>
              </div>
              {(board[stage] ?? []).map(deal => (
                <KanbanCard key={deal._id} deal={deal}
                  onEdit={setModal}
                  onStageChange={stageChange} />
              ))}
            </div>
          ))}
        </div>
      )}

      {modal && <DealModal deal={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />}
    </>
  )
}
