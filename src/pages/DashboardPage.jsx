// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import Layout from '../components/Layout'
import { Spinner } from '../components/UI'
import { getVendorStats, getEvents, getVendors } from '../api/services'

const STATUS_COLORS = { active: '#4cffb4', pending: '#ff9c47', completed: '#5cb8ff', inactive: '#8888aa' }

export default function DashboardPage() {
  const [stats,   setStats]   = useState(null)
  const [events,  setEvents]  = useState([])
  const [recent,  setRecent]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getVendorStats(), getEvents(), getVendors()])
      .then(([s, e, v]) => { setStats(s.data); setEvents(e.data.events); setRecent(v.data.vendors.slice(0, 5)) })
      .finally(() => setLoading(false))
  }, [])

  const activeCount = stats?.by_status?.find(s => s.status === 'active')?.count || 0

  if (loading) return <Layout activeCount={activeCount}><Spinner /></Layout>

  const statCards = [
    { label: 'Total Vendors', value: stats.total, sub: 'All registered', icon: '🏢', color: '#7c5cfc' },
    { label: 'Active',        value: stats.by_status.find(s=>s.status==='active')?.count||0,    sub: 'Currently active', icon: '✅', color: '#4cffb4' },
    { label: 'Pending',       value: stats.by_status.find(s=>s.status==='pending')?.count||0,   sub: 'Awaiting action',  icon: '⏳', color: '#ff9c47' },
    { label: 'Completed',     value: stats.by_status.find(s=>s.status==='completed')?.count||0, sub: 'Contracts closed', icon: '🔒', color: '#5cb8ff' },
  ]

  const catData = stats.by_category.filter(c => c.count > 0).slice(0, 8)

  return (
    <Layout activeCount={activeCount}>
      <div className="topbar"><div className="topbar-title">Dashboard</div></div>
      <div className="page">
        <div className="stats-grid">
          {statCards.map(s => (
            <div key={s.label} className="stat-card" style={{ '--card-accent': s.color }}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-sub">{s.sub}</div>
              <div className="stat-icon">{s.icon}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div className="table-wrap" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text2)', marginBottom: 16 }}>Vendors by Category</div>
            {catData.length === 0
              ? <p style={{ color: 'var(--text2)', fontSize: 12 }}>No data yet</p>
              : <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={catData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="category" tick={{ fontSize: 10, fill: 'var(--text2)', fontFamily: 'DM Mono' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--text2)', fontFamily: 'DM Mono' }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontFamily: 'DM Mono' }} cursor={{ fill: 'rgba(124,92,252,0.08)' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {catData.map((_, i) => <Cell key={i} fill={['#7c5cfc','#4cffb4','#ff9c47','#5cb8ff','#ff5c8a','#e8ff47','#4cffb4','#ff9c47'][i % 8]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            }
          </div>

          <div className="table-wrap" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text2)', marginBottom: 16 }}>Upcoming Events</div>
            {events.length === 0
              ? <p style={{ color: 'var(--text2)', fontSize: 12 }}>No events yet</p>
              : events.slice(0, 5).map(e => (
                  <div key={e.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>{e.event_date} · {e.location}</div>
                    <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>{e.vendors?.length || 0} vendor(s) assigned</div>
                  </div>
                ))
            }
          </div>
        </div>

        <div className="table-wrap">
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text2)' }}>Recent Vendors</div>
          <table>
            <thead><tr><th>Vendor</th><th>Category</th><th>Status</th><th>Events</th></tr></thead>
            <tbody>
              {recent.map(v => (
                <tr key={v.id}>
                  <td><div className="vendor-name">{v.name}</div><div className="vendor-contact">{v.email}</div></td>
                  <td><span className="cat-badge">{v.category}</span></td>
                  <td><span className={`badge badge-${v.status}`}>{v.status}</span></td>
                  <td style={{ color: 'var(--text2)' }}>{v.assigned_events?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
