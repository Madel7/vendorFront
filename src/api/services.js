// src/api/services.js
import client from './client'

// Auth
export const login    = (data) => client.post('/auth/login', data)
export const register = (data) => client.post('/auth/register', data)
export const getMe    = ()     => client.get('/auth/me')

// Vendors
export const getVendors      = (params) => client.get('/vendors', { params })
export const getVendor       = (id)     => client.get(`/vendors/${id}`)
export const createVendor    = (data)   => client.post('/vendors', data)
export const updateVendor    = (id, data) => client.patch(`/vendors/${id}`, data)
export const deleteVendor    = (id)     => client.delete(`/vendors/${id}`)
export const getVendorStats  = ()       => client.get('/vendors/stats')

// Documents
export const getDocuments  = (vendorId)        => client.get(`/vendors/${vendorId}/documents`)
export const uploadDocument = (vendorId, form) => client.post(`/vendors/${vendorId}/documents`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteDocument = (id)             => client.delete(`/documents/${id}`)
export const downloadDoc    = (id)             => client.get(`/documents/${id}/download`, { responseType: 'blob' })

// Events
export const getEvents     = ()         => client.get('/events')
export const getEvent      = (id)       => client.get(`/events/${id}`)
export const createEvent   = (data)     => client.post('/events', data)
export const updateEvent   = (id, data) => client.patch(`/events/${id}`, data)
export const deleteEvent   = (id)       => client.delete(`/events/${id}`)
export const assignVendors = (eventId, vendor_ids) => client.put(`/events/${eventId}/vendors`, { vendor_ids })
