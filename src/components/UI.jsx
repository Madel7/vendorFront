// src/components/UI.jsx  – shared micro-components
import { useEffect } from 'react'

export const statusColor = {
  active: 'badge-active', pending: 'badge-pending',
  completed: 'badge-completed', inactive: 'badge-inactive'
}

export function Badge({ status }) {
  return <span className={`badge ${statusColor[status] || 'badge-inactive'}`}>{status}</span>
}

export function Spinner() {
  return <div className="spinner"><div className="spin" /><span>Loading…</span></div>
}

export function Toast({ msg, type = 'success', onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [onDone])
  return <div className={`toast ${type === 'error' ? 'toast-error' : ''}`}>
    {type === 'error' ? '✕' : '✓'} {msg}
  </div>
}

export function ModalOverlay({ onClose, children }) {
  useEffect(() => {
    const h = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      {children}
    </div>
  )
}

export function ConfirmModal({ message, onConfirm, onClose }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="modal" style={{ width: 360 }}>
        <div className="modal-header"><span className="modal-title">Confirm</span></div>
        <div className="modal-body"><p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{message}</p></div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </ModalOverlay>
  )
}
