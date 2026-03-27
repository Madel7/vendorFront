// src/components/VendorDetail.jsx
import { useState, useRef } from 'react'
import { ModalOverlay, Badge, Spinner } from './UI'
import { uploadDocument, deleteDocument } from '../api/services'

export default function VendorDetail({ vendor, events, onEdit, onAssign, onClose, onRefresh, notify }) {
  const [tab, setTab] = useState('info')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const assignedEvents = events.filter(e => vendor.assigned_events?.some(ae => ae.id === e.id))

  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const form = new FormData(); form.append('file', file); form.append('doc_type', 'document')
    setUploading(true)
    try { await uploadDocument(vendor.id, form); notify('Document uploaded'); onRefresh() }
    catch { notify('Upload failed', 'error') }
    finally { setUploading(false) }
  }

  const handleDeleteDoc = async (docId) => {
    try { await deleteDocument(docId); notify('Document removed'); onRefresh() }
    catch { notify('Delete failed', 'error') }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="modal" style={{ width: 580 }}>
        <div className="detail-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="detail-name">{vendor.name}</div>
              <div className="detail-meta">
                <Badge status={vendor.status} />
                <span className="cat-badge">{vendor.category}</span>
                <span style={{ fontSize: 11, color: 'var(--text2)' }}>Since {vendor.created_at?.slice(0, 10)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <button className="btn btn-ghost btn-sm" onClick={onEdit}>Edit</button>
              <button className="btn btn-ghost btn-sm" onClick={onAssign}>Assign</button>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
          </div>
        </div>
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="tabs" style={{ marginBottom: 0, padding: '0 22px' }}>
            {['info','events','documents'].map(t =>
              <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            )}
          </div>
        </div>
        <div className="modal-body">
          {tab === 'info' && (
            <>
              <div className="detail-section">
                <div className="detail-section-title">Contact</div>
                <div className="detail-grid">
                  <div className="detail-field"><label>Email</label><p>{vendor.email}</p></div>
                  <div className="detail-field"><label>Phone</label><p>{vendor.phone || '—'}</p></div>
                </div>
              </div>
              {vendor.notes && (
                <div className="detail-section">
                  <div className="detail-section-title">Notes</div>
                  <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{vendor.notes}</p>
                </div>
              )}
              <div className="detail-section">
                <div className="detail-section-title">Stats</div>
                <div className="detail-grid">
                  <div className="detail-field"><label>Events</label><p>{vendor.assigned_events?.length || 0}</p></div>
                  <div className="detail-field"><label>Documents</label><p>{vendor.documents?.length || 0}</p></div>
                </div>
              </div>
            </>
          )}
          {tab === 'events' && (
            <div>
              {assignedEvents.length === 0
                ? <div className="empty"><div className="empty-icon">📅</div><div className="empty-text">No events assigned</div></div>
                : assignedEvents.map(e => (
                    <div key={e.id} style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{e.event_date} · {e.location}</div>
                    </div>
                  ))
              }
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={onAssign}>+ Manage</button>
            </div>
          )}
          {tab === 'documents' && (
            <div>
              {vendor.documents?.length === 0
                ? <div className="empty"><div className="empty-icon">📄</div><div className="empty-text">No documents yet</div></div>
                : vendor.documents?.map(d => (
                    <div key={d.id} className="doc-item">
                      <span style={{ fontSize: 18 }}>{d.doc_type === 'contract' ? '📝' : '📁'}</span>
                      <div><div className="doc-name">{d.name}</div><div className="doc-meta">{d.doc_type} · {d.uploaded_at?.slice(0,10)}</div></div>
                      <div className="doc-actions">
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDoc(d.id)}>✕</button>
                      </div>
                    </div>
                  ))
              }
              <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleUpload} />
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => fileRef.current.click()} disabled={uploading}>
                {uploading ? 'Uploading…' : '+ Upload Document'}
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalOverlay>
  )
}
