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
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-200" onClick={token ? onClose : undefined}>
      <div className="bg-white rounded-bento shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-dark">{token ? 'Token Generated' : 'Create API Token'}</h2>
          {!token && <button className="text-brand-slate hover:text-brand-dark transition-colors" onClick={onClose}><X size={20} /></button>}
        </div>
        
        <div className="p-8">
          {token ? (
            <div className="space-y-6">
              <div className="p-4 bg-brand-amber bg-opacity-10 border border-brand-amber/20 rounded-xl">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Important Security Warning</p>
                <p className="text-sm text-balance text-amber-900/80 leading-relaxed">
                  Copy this token now. For security reasons, we cannot show it to you again once you close this window.
                </p>
              </div>
              
              <div className="relative group">
                <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs break-all text-brand-green font-bold pr-12">
                  {token}
                </div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(token) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-brand-green/10 text-brand-slate hover:text-brand-green rounded-lg transition-colors"
                >
                  <Key size={16} />
                </button>
              </div>

              <button 
                className="w-full btn-brand justify-center py-3 shadow-lg shadow-brand-green/20"
                onClick={onClose}
              >
                I've Saved the Token
              </button>
            </div>
          ) : (
            <form onSubmit={create} className="space-y-5">
              {err && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">{err}</div>}
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-slate uppercase tracking-wider pl-1">Token Identifier</label>
                <input 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all placeholder:text-gray-400"
                  value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Production API Sync" 
                />
              </div>

              <div className="pt-2 flex gap-3 justify-end">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-brand shadow-lg shadow-brand-green/20">
                  <Plus size={18} /> Generate Token
                </button>
              </div>
            </form>
          )}
        </div>
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
    if (!confirm('Revoke this token? Access will be immediately lost.')) return
    await api.delete(`/tokens/${id}`); load()
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark flex items-center gap-3">
            <Key className="text-brand-green" size={28} /> API Tokens
          </h1>
          <p className="text-brand-slate font-medium mt-1">Manage secure access keys for third-party integrations.</p>
        </div>
        <button className="btn-brand shadow-lg shadow-brand-green/20 py-2.5 px-6" onClick={() => setModal(true)}>
          <Plus size={18} /> New Token
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
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider">Token Name</th>
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider text-center">Status</th>
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider">Created</th>
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider">Last Used</th>
                  <th className="px-8 py-4 font-bold text-brand-slate text-[10px] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tokens.length > 0 ? tokens.map(t => (
                  <tr key={t.id} className="group hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-brand-dark group-hover:text-brand-green transition-colors">{t.name}</div>
                      <div className="text-[10px] text-brand-slate font-bold uppercase tracking-tight mt-0.5">ID: {t.id.slice(-8)}</div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-2.5 py-1 bg-brand-lime text-brand-green text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Active
                      </span>
                    </td>
                    <td className="px-8 py-5 font-medium text-brand-slate text-sm">
                      {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 font-medium text-brand-slate text-sm">
                      {t.last_used_at ? new Date(t.last_used_at).toLocaleDateString() : (
                        <span className="italic opacity-60">Never used</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        className="p-2 hover:bg-red-50 text-brand-slate hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100" 
                        onClick={() => revoke(t.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-brand-slate font-medium">
                      No active tokens found. Create a token to start using our API.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && <CreateTokenModal onClose={() => setModal(false)} onCreated={load} />}
    </div>
  )
}
