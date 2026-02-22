import { useEffect, useState } from 'react'
import api from '../api/client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { TrendingUp, Users, Briefcase, Target } from 'lucide-react'

const DONUT_COLORS = ['#6c63ff', '#22c55e', '#f59e0b', '#ef4444', '#4ecdc4', '#a78bfa']

export default function Dashboard() {
  const [revenue,    setRevenue]    = useState([])
  const [conversion, setConversion] = useState(null)
  const [sales,      setSales]      = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [r, c, s] = await Promise.all([
          api.get('/analytics/revenue'),
          api.get('/analytics/conversion'),
          api.get('/analytics/sales'),
        ])
        setRevenue(r.data.data)
        setConversion(c.data.data)
        setSales(s.data.data)
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [])

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const revenueData = revenue.map(r => ({
    name: MONTHS[r.month - 1],
    revenue: r.total_revenue,
  }))

  const donutData = conversion ? Object.entries(conversion.by_status ?? {}).map(([k, v]) => ({
    name: k, value: v
  })) : []

  if (loading) return <div className="loading-page"><span className="spinner" /></div>

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <span className="text-muted" style={{ fontSize: '0.85rem' }}>Analytics Overview</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <TrendingUp size={22} color="#6c63ff" />
          <div className="stat-value">${revenue.reduce((a, r) => a + r.total_revenue, 0).toLocaleString()}</div>
          <div className="stat-label">Total Revenue (YTD)</div>
        </div>
        <div className="stat-card">
          <Target size={22} color="#22c55e" />
          <div className="stat-value">{conversion?.conversion_rate ?? 0}%</div>
          <div className="stat-label">Lead Conversion Rate</div>
        </div>
        <div className="stat-card">
          <Users size={22} color="#f59e0b" />
          <div className="stat-value">{conversion?.total ?? 0}</div>
          <div className="stat-label">Total Leads</div>
        </div>
        <div className="stat-card">
          <Briefcase size={22} color="#4ecdc4" />
          <div className="stat-value">{conversion?.won ?? 0}</div>
          <div className="stat-label">Deals Won</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-title">Monthly Revenue</div>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1a1f2e', border: '1px solid #2e3650', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={v => [`$${v.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#6c63ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-muted mt-4">No revenue data yet.</p>}
        </div>

        <div className="card">
          <div className="card-title">Lead Status Breakdown</div>
          {donutData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                  labelLine={false}>
                  {donutData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #2e3650', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-muted mt-4">No lead data yet.</p>}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Top Sales Performers</div>
        <div className="table-wrapper mt-4">
          <table>
            <thead><tr><th>#</th><th>Rep</th><th>Deals Closed</th><th>Revenue</th></tr></thead>
            <tbody>
              {sales.length > 0 ? sales.map((s, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{s.user_name}</td>
                  <td>{s.deals_closed}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 600 }}>${s.total_revenue?.toLocaleString()}</td>
                </tr>
              )) : <tr><td colSpan={4} className="text-muted">No sales data yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
