import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar    from './components/Sidebar'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Dashboard  from './pages/Dashboard'
import Leads      from './pages/Leads'
import Contacts   from './pages/Contacts'
import Deals      from './pages/Deals'
import Roles      from './pages/Roles'
import Tokens     from './pages/Tokens'

import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

function PrivateLayout() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen bg-brand-surface font-sans">
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-2 text-brand-green">
           <Zap size={20} className="fill-current" />
           <span className="text-xl font-bold tracking-tight text-brand-dark">DocMonitoring</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-brand-slate hover:text-brand-green transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar with mobile toggle */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[45]" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className={`flex-1 p-4 lg:p-8 max-w-[1600px] mx-auto w-full transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-64'} pt-24 lg:pt-8`}>
        <Routes>
          <Route path="/"            element={<Dashboard />} />
          <Route path="/leads"       element={<Leads />} />
          <Route path="/contacts"    element={<Contacts />} />
          <Route path="/deals"       element={<Deals />} />
          <Route path="/roles"       element={<Roles />} />
          <Route path="/tokens"      element={<Tokens />} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*"        element={<PrivateLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
