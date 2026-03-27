// src/components/Layout.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/',        icon: '◈', label: 'Dashboard' },
  { to: '/vendors', icon: '⬡', label: 'Vendors'   },
  { to: '/events',  icon: '◻', label: 'Events'    },
]

export default function Layout({ children, activeCount }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">Vendor<span>OS</span></div>
          <div className="logo-sub">Supplier Management</div>
        </div>
        <nav className="nav">
          <div className="nav-label">Navigation</div>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <span className="nav-icon">{n.icon}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ marginBottom: 8 }}><span className="status-dot" />{activeCount ?? '…'} Active Vendors</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11 }}>{user?.name}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ fontSize: 10, padding: '3px 8px' }}>Logout</button>
          </div>
        </div>
      </aside>
      <div className="main">{children}</div>
    </div>
  )
}
