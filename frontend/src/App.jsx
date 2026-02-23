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

function PrivateLayout() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return (
    <div className="flex min-h-screen bg-brand-surface font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-[1600px] mx-auto w-full transition-all duration-300">
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
