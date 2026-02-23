import { useEffect, useState } from 'react'
import api from '../api/client'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Legend
} from 'recharts'
import { TrendingUp, Users, Briefcase, Target, ArrowUpRight, DollarSign, Activity, Zap as ZapIcon } from 'lucide-react'

const DONUT_COLORS = ['#11692F', '#D9F99D', '#FDE68A', '#FCA5A5', '#93C5FD', '#C084FC']

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

  const processedData = revenue.map((r, i) => {
    const prev = revenue[i - 1]?.total_revenue || 0
    const mom = prev ? ((r.total_revenue - prev) / prev) * 100 : 0
    return {
      name: MONTHS[r.month - 1],
      revenue: r.total_revenue,
      avg_deal: r.deal_count ? r.total_revenue / r.deal_count : 0,
      mom: mom.toFixed(1),
      trend: r.total_revenue * 1.05 // Simplified trend projection
    }
  })

  const donutData = conversion ? Object.entries(conversion.by_status ?? {}).map(([k, v]) => ({
    name: k, value: v
  })) : []

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
    </div>
  )

  const totalRevenue = revenue.reduce((a, r) => a + r.total_revenue, 0)
  const avgMonthlyRevenue = totalRevenue / (revenue.length || 1)
  const latestMoM = processedData[processedData.length - 1]?.mom || 0
  const avgDealSize = totalRevenue / (revenue.reduce((a, r) => a + r.deal_count, 0) || 1)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-brand-dark">Overview</h1>
        <p className="text-brand-slate font-medium mt-1">Welcome back. Here's what's happening today.</p>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* KPI: Revenue */}
        <div className="md:col-span-3 bento-card flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-brand-green/10 p-2 rounded-lg text-brand-green">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs font-bold text-brand-green bg-brand-green/10 px-2 py-1 rounded">+{latestMoM}%</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold tracking-tight">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-sm font-medium text-brand-slate mt-1">Total Revenue (YTD)</div>
          </div>
        </div>

        {/* KPI: Conversion */}
        <div className="md:col-span-3 bento-card flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-brand-lime/20 p-2 rounded-lg text-brand-green">
              <Target size={20} />
            </div>
            <span className="text-xs font-bold text-brand-green bg-brand-green/10 px-2 py-1 rounded">Target</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold tracking-tight">{conversion?.conversion_rate ?? 0}%</div>
            <div className="text-sm font-medium text-brand-slate mt-1">Conversion Rate</div>
          </div>
        </div>

        {/* KPI: Leads */}
        <div className="md:col-span-3 bento-card flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold tracking-tight">{conversion?.total ?? 0}</div>
            <div className="text-sm font-medium text-brand-slate mt-1">Total Leads</div>
          </div>
        </div>

        {/* KPI: Deals */}
        <div className="md:col-span-3 bento-card flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold tracking-tight">{conversion?.won ?? 0}</div>
            <div className="text-sm font-medium text-brand-slate mt-1">Deals Won</div>
          </div>
        </div>

        {/* Revenue Trend Chart & Growth Hub */}
        <div className="md:col-span-8 bento-card !p-0 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-brand-dark">Revenue Dynamics</h3>
              <p className="text-sm font-medium text-brand-slate">Performance metrics and projections</p>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] font-bold text-brand-slate uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-green" /> Actual
              </div>
              <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] font-bold text-brand-slate uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-slate" opacity="0.3" /> Trend
              </div>
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-12">
            {/* Chart Area */}
            <div className="col-span-8 p-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 shadow-xl border border-gray-100 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                            <p className="text-[10px] font-black text-brand-slate uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between gap-4 text-sm">
                                <span className="font-medium text-brand-slate">Actual</span>
                                <span className="font-bold text-brand-dark">${payload[0].value?.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between gap-4 text-sm">
                                <span className="font-medium text-brand-slate">MoM Growth</span>
                                <span className={payload[0].payload.mom >= 0 ? 'text-brand-green font-bold' : 'text-red-500 font-bold'}>
                                  {payload[0].payload.mom}%
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#166534" 
                    radius={[6, 6, 0, 0]} 
                    barSize={40}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="trend" 
                    stroke="#94A3B8" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Growth Hub Details */}
            <div className="col-span-4 bg-gray-50/50 border-l border-gray-50 p-6 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-brand-slate uppercase tracking-[2px]">Avg Deal Size</label>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-brand-green/10 rounded-lg text-brand-green">
                    <DollarSign size={16} />
                  </div>
                  <span className="text-xl font-bold text-brand-dark">${avgDealSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-brand-slate uppercase tracking-[2px]">Growth Velocity</label>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600">
                    <Activity size={16} />
                  </div>
                  <span className="text-xl font-bold text-brand-dark">Medium</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200/50">
                <button className="w-full flex items-center justify-between group p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-brand-green/30 transition-all">
                  <div className="flex items-center gap-2">
                    <ZapIcon size={14} className="text-brand-green" />
                    <span className="text-xs font-bold text-brand-dark">Quarterly Report</span>
                  </div>
                  <ArrowUpRight size={14} className="text-brand-slate group-hover:text-brand-green transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Status (Donut) */}
        <div className="md:col-span-4 bento-card h-[400px] flex flex-col">
          <h3 className="text-lg font-bold mb-6 text-center">Lead Status</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={donutData} 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] uppercase font-bold text-brand-slate">
            {donutData.slice(0, 4).map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: DONUT_COLORS[i] }} />
                <span>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Performers Table */}
        <div className="md:col-span-12 bento-card overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Top Sales Performers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 font-bold text-brand-slate text-xs uppercase tracking-wider">Representative</th>
                  <th className="pb-4 font-bold text-brand-slate text-xs uppercase tracking-wider">Deals</th>
                  <th className="pb-4 font-bold text-brand-slate text-xs uppercase tracking-wider text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sales.map((s, i) => (
                  <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-semibold text-brand-dark flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center text-xs font-bold">
                        {s.user_name?.charAt(0).toUpperCase()}
                      </div>
                      {s.user_name}
                    </td>
                    <td className="py-4 text-brand-slate font-medium">{s.deals_closed} closed</td>
                    <td className="py-4 text-right font-bold text-brand-green">
                      ${s.total_revenue?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
