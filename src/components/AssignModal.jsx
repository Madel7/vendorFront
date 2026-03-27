// src/components/AssignModal.jsx
import { useState } from 'react'
import { ModalOverlay } from './UI'

export default function AssignModal({ vendor, events, onSave, onClose, loading }) {
  const [selected, setSelected] = useState(new Set(vendor.assigned_events?.map(e => e.id) || []))
  const toggle = id => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <ModalOverlay onClose={onClose}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Assign Events — {vendor.name}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {events.length === 0 && <p style={{ fontSize: 13, color: 'var(--text2)' }}>No events created yet.</p>}
          {events.map(e => (
            <div key={e.id} onClick={() => toggle(e.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 13px', marginBottom: 8, cursor: 'pointer',
              border: `1px solid ${selected.has(e.id) ? 'var(--accent2)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)',
              background: selected.has(e.id) ? 'rgba(124,92,252,0.08)' : 'transparent',
              transition: 'all 0.15s'
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                border: `2px solid ${selected.has(e.id) ? 'var(--accent2)' : 'var(--border2)'}`,
                background: selected.has(e.id) ? 'var(--accent2)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 10
              }}>{selected.has(e.id) ? '✓' : ''}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{e.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>{e.event_date} · {e.location}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave([...selected])} disabled={loading}>
            {loading ? 'Saving…' : 'Save Assignments'}
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}
