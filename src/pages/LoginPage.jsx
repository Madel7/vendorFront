// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as apiLogin, register as apiRegister } from '../api/services'

export default function LoginPage() {
  const [mode, setMode]     = useState('login') // 'login' | 'register'
  const [form, setForm]     = useState({ name: '', email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const upd = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const submit = async () => {
    setLoading(true); setError('')
    try {
      const fn   = mode === 'login' ? apiLogin : apiRegister
      const { data } = await fn(form)
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally { setLoading(false) }
  }

  const handleKey = e => { if (e.key === 'Enter') submit() }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Vendor<span>OS</span></div>
        <div className="auth-sub">{mode === 'login' ? 'Sign in to your account' : 'Create a new account'}</div>

        {mode === 'register' && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={e => upd('name', e.target.value)} placeholder="Jane Smith" onKeyDown={handleKey} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={e => upd('email', e.target.value)} placeholder="you@company.com" onKeyDown={handleKey} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={form.password} onChange={e => upd('password', e.target.value)} placeholder="••••••••" onKeyDown={handleKey} />
        </div>

        {error && <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 12, padding: '8px 12px', background: 'rgba(255,92,92,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,92,92,0.2)' }}>{error}</div>}

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} onClick={submit} disabled={loading}>
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <div className="auth-switch">
          {mode === 'login' ? <>No account? <a onClick={() => setMode('register')}>Register</a></> : <>Have an account? <a onClick={() => setMode('login')}>Sign in</a></>}
        </div>

        {mode === 'login' && (
          <div style={{ marginTop: 16, padding: '10px 12px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', fontSize: 11, color: 'var(--text2)' }}>
            Demo login: <span style={{ color: 'var(--text)' }}>admin@vendoros.com</span> / <span style={{ color: 'var(--text)' }}>password123</span>
          </div>
        )}
      </div>
    </div>
  )
}
