// src/pages/EventsPage.jsx
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Spinner, Toast, ModalOverlay, ConfirmModal } from '../components/UI'
import { getEvents, createEvent, deleteEvent, getVendorStats } from '../api/services'

function EventModal({ event, onSave, onClose, loading }) {
  const isEdit = !!event?.id
  const [form, setForm] = useState({ name: event?.name || '', event_date: event?.event_date || '', location: event?.location || '', description: event?.description || '' })
  const [errors, setErrors] = useState({})
  const upd = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }
  const submit = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.event_date) e.event_date = 'Required'
    if (Object.keys(e).length) { setErrors(e); return }
    onSave(form)
  }
  return (
    <ModalOverlay onClose={onClose}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Edit Event' : 'Add New Event'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Event Name *</label>
            <input className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={e => upd('name', e.target.value)} placeholder="Annual Gala 2025" />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input type="date" className={`form-input ${errors.event_date ? 'error' : ''}`} value={form.event_date} onChange={e => upd('event_date', e.target.value)} />
              {errors.event_date && <span className="error-msg">{errors.event_date}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={e => upd('location', e.target.value)} placeholder="Grand Ballroom" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => upd('description', e.target.value)} placeholder="Event details…" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Event'}</button>
        </div>
      </div>
    </ModalOverlay>
  )
}

export default function EventsPage() {
  const [events,    setEvents]    = useState([])
  const [stats,     setStats]     = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [modal,     setModal]     = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [toast,     setToast]     = useState(null)

  const notify = (msg, type = 'success') => setToast({ msg, type })

  const load = async () => {
    setLoading(true)
    try {
      const [eRes, sRes] = await Promise.all([getEvents(), getVendorStats()])
      setEvents(eRes.data.events); setStats(sRes.data)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (form) => {
    setSaving(true)
    try { await createEvent(form); notify('Event created'); setModal(false); load() }
    catch (err) { notify(err.response?.data?.error || 'Failed', 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await deleteEvent(confirmId); notify('Event deleted'); setConfirmId(null); load() }
    catch { notify('Delete failed', 'error') }
  }

  const activeCount = stats?.by_status?.find(s => s.status === 'active')?.count || 0

  return (
    <Layout activeCount={activeCount}>
      <div className="topbar">
        <div className="topbar-title">Events</div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Add Event</button>
      </div>
      <div className="page">
        {loading ? <Spinner /> : events.length === 0
          ? <div className="empty"><div className="empty-icon">📅</div><div className="empty-text">No events yet. Create your first one.</div></div>
          : events.map(e => (
              <div key={e.id} className="event-card">
                <div className="event-card-header">
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16 }}>{e.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>📅 {e.event_date} &nbsp;·&nbsp; 📍 {e.location}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'var(--accent)' }}>
                      {e.vendors?.length || 0}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text2)', marginLeft: 3 }}>vendors</span>
                    </span>
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmId(e.id)}>✕</button>
                  </div>
                </div>
                <div className="event-card-body">
                  {e.description && <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 14 }}>{e.description}</p>}
                  {!e.vendors?.length
                    ? <p style={{ fontSize: 12, color: 'var(--text2)' }}>No vendors assigned — go to Vendors to assign them.</p>
                    : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                        {e.vendors.map(v => (
                          <div key={v.id} style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface2)' }}>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{v.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{v.category}</div>
                            <span className={`badge badge-${v.status}`} style={{ marginTop: 6, display: 'inline-flex' }}>{v.status}</span>
                          </div>
                        ))}
                      </div>
                  }
                </div>
              </div>
            ))
        }
      </div>

      {modal && <EventModal onSave={handleSave} onClose={() => setModal(false)} loading={saving} />}
      {confirmId && <ConfirmModal message="Delete this event? Vendor assignments will also be removed." onConfirm={handleDelete} onClose={() => setConfirmId(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </Layout>
  )
}
