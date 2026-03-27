// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Spinner } from './components/UI'
import LoginPage    from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import VendorsPage  from './pages/VendorsPage'
import EventsPage   from './pages/EventsPage'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Protected><DashboardPage /></Protected>} />
      <Route path="/vendors" element={<Protected><VendorsPage /></Protected>} />
      <Route path="/events"  element={<Protected><EventsPage /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
