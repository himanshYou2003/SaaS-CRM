import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Users, Phone, Briefcase,
  ShieldCheck, Key, LogOut, Zap, X
} from 'lucide-react'

const SECTIONS = [
  {
    title: 'Main',
    items: [
      { to: '/',         icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/leads',    icon: Users,           label: 'Leads'     },
    ]
  },
  {
    title: 'Management',
    items: [
      { to: '/contacts', icon: Phone,           label: 'Contacts'  },
      { to: '/deals',    icon: Briefcase,       label: 'Deals'     },
    ]
  },
  {
    title: 'Settings',
    items: [
      { to: '/roles',    icon: ShieldCheck,     label: 'Roles'     },
      { to: '/tokens',   icon: Key,             label: 'API Tokens'},
    ]
  }
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()

  return (
    <nav className={`
      fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-[#E5E7EB] flex flex-col py-6 z-50
      transition-transform duration-300 ease-in-out
      lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="px-6 mb-8 flex items-center justify-between text-brand-green">
        <div className="flex items-center gap-2">
          <div className="bg-brand-green/10 p-2 rounded-lg">
            <Zap size={20} className="fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-brand-dark">DocMonitoring</span>
        </div>
        {/* Close button for mobile */}
        <button className="lg:hidden p-2 text-brand-slate hover:text-brand-green" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="px-3 flex-1 flex flex-col gap-8 overflow-y-auto scrollbar-hide">
        {SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            <h3 className="px-4 text-[10px] font-black text-brand-slate uppercase tracking-[2px] mb-2 opacity-50">
              {section.title}
            </h3>
            {section.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) => `
                  relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-brand-green/10 text-brand-green' 
                    : 'text-brand-slate hover:bg-gray-50 hover:text-brand-dark'}
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-brand-green rounded-r-full animate-in slide-in-from-left-2 duration-300" />
                    )}
                    <Icon 
                      size={18} 
                      className={isActive ? 'text-brand-green' : 'text-brand-slate group-hover:text-brand-green transition-colors'} 
                    />
                    <span className={`font-semibold text-sm ${isActive ? 'text-brand-dark' : ''}`}>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-auto px-4 pt-6">
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-brand-dark truncate leading-tight">{user?.name}</div>
              <div className="text-[10px] font-bold text-brand-slate truncate uppercase tracking-tight">{user?.email}</div>
            </div>
          </div>
          <button 
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-red-100 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all shadow-sm" 
            onClick={logout}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
