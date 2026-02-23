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
    <nav className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-[#E5E7EB] flex flex-col py-6 z-50">
      <div className="px-6 mb-8 flex items-center gap-2 text-brand-green">
        <div className="bg-brand-green/10 p-2 rounded-lg">
          <Zap size={20} className="fill-current" />
        </div>
        <span className="text-xl font-bold tracking-tight text-brand-dark">DocMonitoring</span>
      </div>

      <div className="px-3 flex-1 flex flex-col gap-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group
              ${isActive 
                ? 'bg-brand-green text-white shadow-md' 
                : 'text-brand-slate hover:bg-gray-50 hover:text-brand-dark'}
            `}
          >
            <Icon size={18} className={`${({ isActive }) => isActive ? 'text-white' : 'text-brand-slate group-hover:text-brand-green'}`} />
            <span className="font-medium text-sm">{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="mt-auto px-4 pt-6 border-t border-gray-100 flex flex-col gap-4">
        <div className="px-2">
          <div className="text-sm font-semibold text-brand-dark truncate">{user?.name}</div>
          <div className="text-xs text-brand-slate truncate">{user?.email}</div>
        </div>
        <button 
          className="btn-ghost w-full justify-center text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600" 
          onClick={logout}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </nav>
  )
}
