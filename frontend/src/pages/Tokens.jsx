import { useEffect, useState } from 'react'
import api from '../api/client'
import { Plus, Key, Trash2, X } from 'lucide-react'

function CreateTokenModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [token, setToken] = useState(null)
  const [err, setErr] = useState('')

  const create = async (e) => {
    e.preventDefault(); setErr('')
    try {
      const r = await api.post('/tokens', { name })
      setToken(r.data.data.token)
      onCreated()
    } catch (err) { setErr(err.response?.data?.message ?? 'Failed to create token.') }
  }

  return (
    <div className="modal-overlay" onClick={token ? onClose : undefined}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{token ? '🎉 Token Created' : 'Create API Token'}</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        {token ? (
          <>
            <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>
              Copy your token now — it will <strong>never be shown again</strong>.
            </p>
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '12px 16px', fontFamily: 'monospace',
              fontSize: '0.8rem', wordBreak: 'break-all', color: 'var(--accent)', marginBottom: 16 }}>
              {token}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => { navigator.clipboard.writeText(token); onClose() }}>
              Copy & Close
            </button>
          </>
        ) : (
          <form onSubmit={create}>
            {err && <div className="error-msg mb-4">{err}</div>}
            <div className="form-group"><label>Token Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. CI/CD Pipeline" /></div>
            <div className="flex-gap" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary"><Key size={15} /> Generate</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function Tokens() {
  const [tokens,  setTokens]  = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)

  const load = async () => {
    setLoading(true)
    try { const r = await api.get('/tokens'); setTokens(r.data.data) }
    catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const revoke = async (id) => {
    if (!confirm('Revoke this token?')) return
    await api.delete(`/tokens/${id}`); load()
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title"><Key size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />API Tokens</h1>
        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> New Token</button>
      </div>

      {loading ? <div className="loading-page"><span className="spinner" /></div> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Name</th><th>Created</th><th>Last Used</th><th></th></tr></thead>
            <tbody>
              {tokens.length > 0 ? tokens.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td className="text-muted">{new Date(t.created_at).toLocaleDateString()}</td>
                  <td className="text-muted">{t.last_used_at ? new Date(t.last_used_at).toLocaleDateString() : 'Never'}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => revoke(t.id)}>
                      <Trash2 size={14} /> Revoke
                    </button>
                  </td>
                </tr>
              )) : <tr><td colSpan={4} className="text-muted" style={{ padding: 24 }}>No tokens yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && <CreateTokenModal onClose={() => setModal(false)} onCreated={load} />}
    </>
  )
}
