// src/api/client.js
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || ''

const client = axios.create({ baseURL: `${BASE}/api` })

client.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  console.log("[v0] API Request:", { url: cfg.url, method: cfg.method })
  return cfg
})

client.interceptors.response.use(
  r => r,
  err => {
    console.log("[v0] API Response Error:", {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message,
      config: err.config?.url
    })
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default client
