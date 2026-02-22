import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Users, Phone, Briefcase,
  ShieldCheck, Key, LogOut, Zap
} from 'lucide-react'

const NAV = [
  { to: '/',         icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads',    icon: Users,           label: 'Leads'     },
  { to: '/contacts', icon: Phone,           label: 'Contacts'  },
  { to: '/deals',    icon: Briefcase,       label: 'Deals'     },
  { to: '/roles',    icon: ShieldCheck,     label: 'Roles'     },
  { to: '/tokens',   icon: Key,             label: 'API Tokens'},
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <Zap size={22} />
        SaaS CRM
      </div>

      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}

      <div style={{ marginTop: 'auto', padding: '0 20px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10 }}>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{user?.name}</div>
          <div>{user?.email}</div>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={logout}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </nav>
  )
}
