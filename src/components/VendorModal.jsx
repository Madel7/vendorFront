// src/components/VendorModal.jsx
import { useState } from 'react'
import { ModalOverlay } from './UI'

const CATEGORIES = ['Audio/Visual','Catering','Entertainment','Florals','Photography','Transportation','Security','Decor','Other']
const STATUSES   = ['active','pending','completed','inactive']

export default function VendorModal({ vendor, onSave, onClose, loading }) {
  const isEdit = !!vendor?.id
  const [form, setForm] = useState({
    name: vendor?.name || '', category: vendor?.category || 'Audio/Visual',
    email: vendor?.email || '', phone: vendor?.phone || '',
    status: vendor?.status || 'pending', notes: vendor?.notes || ''
  })
  const [errors, setErrors] = useState({})

  const upd = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    return e
  }

  const submit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave(form)
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Edit Vendor' : 'Add New Vendor'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Vendor Name *</label>
              <input className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={e => upd('name', e.target.value)} placeholder="Company name" />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => upd('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className={`form-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={e => upd('email', e.target.value)} placeholder="email@company.com" />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={e => upd('phone', e.target.value)} placeholder="+1 555-0000" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e => upd('status', e.target.value)}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={form.notes} onChange={e => upd('notes', e.target.value)} placeholder="Additional notes…" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Vendor'}
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}
