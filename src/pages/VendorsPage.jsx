// src/pages/VendorsPage.jsx
import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import VendorModal from '../components/VendorModal'
import VendorDetail from '../components/VendorDetail'
import AssignModal from '../components/AssignModal'
import { Spinner, Toast, Badge, ConfirmModal } from '../components/UI'
import { getVendors, createVendor, updateVendor, deleteVendor, getVendorStats, getEvents, assignVendors } from '../api/services'

const CATEGORIES = ['All','Audio/Visual','Catering','Entertainment','Florals','Photography','Transportation','Security','Decor','Other']

export default function VendorsPage() {
  const [vendors,  setVendors]  = useState([])
  const [events,   setEvents]   = useState([])
  const [stats,    setStats]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [search,   setSearch]   = useState('')
  const [statusF,  setStatusF]  = useState('all')
  const [catF,     setCatF]     = useState('All')
  const [modal,    setModal]    = useState(null)
  const [detail,   setDetail]   = useState(null)
  const [assignV,  setAssignV]  = useState(null)
  const [confirmId,setConfirmId]= useState(null)
  const [toast,    setToast]    = useState(null)

  const notify = (msg, type = 'success') => setToast({ msg, type })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (statusF !== 'all') params.status = statusF
      if (catF !== 'All') params.category = catF
      if (search) params.search = search
      const [vRes, eRes, sRes] = await Promise.all([getVendors(params), getEvents(), getVendorStats()])
      setVendors(vRes.data.vendors)
      setEvents(eRes.data.events)
      setStats(sRes.data)
    } finally { setLoading(false) }
  }, [statusF, catF, search])

  useEffect(() => { load() }, [load])

  const handleSave = async (form) => {
    setSaving(true)
    try {
      if (modal?.vendor?.id) { await updateVendor(modal.vendor.id, form); notify('Vendor updated') }
      else                   { await createVendor(form); notify('Vendor added') }
      setModal(null); load()
    } catch (err) { notify(err.response?.data?.error || 'Save failed', 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await deleteVendor(confirmId); notify('Vendor deleted'); setConfirmId(null); load() }
    catch { notify('Delete failed', 'error') }
  }

  const handleAssign = async (vendorId, eventIds) => {
    setSaving(true)
    try {
      // Assign vendor to each selected event, remove from unselected
      for (const e of events) {
        const currentIds = vendors.find(v => v.id === vendorId)?.assigned_events?.map(x => x.id) || []
        const shouldHave = eventIds.includes(e.id)
        const has = currentIds.includes(e.id)
        if (shouldHave !== has) {
          // rebuild full vendor list for that event
          const eVendors = vendors.filter(v => v.assigned_events?.some(x => x.id === e.id)).map(v => v.id)
          const newList = shouldHave ? [...eVendors, vendorId] : eVendors.filter(id => id !== vendorId)
          await assignVendors(e.id, newList)
        }
      }
      notify('Events updated'); setAssignV(null); load()
    } catch { notify('Assignment failed', 'error') }
    finally { setSaving(false) }
  }

  const activeCount = stats?.by_status?.find(s => s.status === 'active')?.count || 0

  return (
    <Layout activeCount={activeCount}>
      <div className="topbar">
        <div className="topbar-title">Vendors & Suppliers</div>
        <button className="btn btn-primary" onClick={() => setModal({ type: 'add' })}>+ Add Vendor</button>
      </div>
      <div className="page">
        <div className="filter-bar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors…" />
          </div>
          {['all','active','pending','completed','inactive'].map(s => (
            <button key={s} className={`filter-chip ${statusF === s ? 'active' : ''}`} onClick={() => setStatusF(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <select className="filter-select" value={catF} onChange={e => setCatF(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {loading ? <Spinner /> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Vendor</th><th>Category</th><th>Status</th><th>Events</th><th>Docs</th><th>Actions</th></tr></thead>
              <tbody>
                {vendors.length === 0
                  ? <tr><td colSpan={6}><div className="empty"><div className="empty-icon">🏢</div><div className="empty-text">No vendors found</div></div></td></tr>
                  : vendors.map(v => (
                      <tr key={v.id} onClick={() => setDetail(v)} style={{ cursor: 'pointer' }}>
                        <td><div className="vendor-name">{v.name}</div><div className="vendor-contact">{v.email}</div></td>
                        <td><span className="cat-badge">{v.category}</span></td>
                        <td><Badge status={v.status} /></td>
                        <td style={{ color: 'var(--text2)' }}>{v.assigned_events?.length || 0}</td>
                        <td style={{ color: 'var(--text2)' }}>{v.documents?.length || 0}</td>
                        <td>
                          <div className="action-btns" onClick={e => e.stopPropagation()}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: 'edit', vendor: v })}>Edit</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setAssignV(v)}>Assign</button>
                            <button className="btn btn-danger btn-sm" onClick={() => setConfirmId(v.id)}>✕</button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && <VendorModal vendor={modal.vendor} onSave={handleSave} onClose={() => setModal(null)} loading={saving} />}

      {detail && (
        <VendorDetail
          vendor={vendors.find(v => v.id === detail.id) || detail}
          events={events}
          onEdit={() => { setModal({ type: 'edit', vendor: detail }); setDetail(null) }}
          onAssign={() => { setAssignV(vendors.find(v => v.id === detail.id)); setDetail(null) }}
          onClose={() => setDetail(null)}
          onRefresh={load}
          notify={notify}
        />
      )}

      {assignV && (
        <AssignModal
          vendor={vendors.find(v => v.id === assignV.id) || assignV}
          events={events}
          onSave={(ids) => handleAssign(assignV.id, ids)}
          onClose={() => setAssignV(null)}
          loading={saving}
        />
      )}

      {confirmId && (
        <ConfirmModal
          message="Are you sure you want to delete this vendor? This cannot be undone."
          onConfirm={handleDelete}
          onClose={() => setConfirmId(null)}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </Layout>
  )
}
