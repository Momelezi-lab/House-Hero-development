import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API functions
export const pricingApi = {
  getCategories: async () => {
    const response = await api.get('/api/pricing')
    return response.data
  },
  getPricingByCategory: async (category: string) => {
    const response = await api.get(`/api/pricing?category=${category}`)
    return response.data
  },
}

export const serviceRequestApi = {
  create: async (data: any) => {
    const response = await api.post('/api/service-requests', data)
    return response.data
  },
  getAll: async (params?: { status?: string; category?: string; search?: string }) => {
    const response = await api.get('/api/service-requests', { params })
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/service-requests/${id}`)
    return response.data
  },
  update: async (id: number, data: any) => {
    const response = await api.patch(`/api/service-requests/${id}`, data)
    return response.data
  },
}

export const providerApi = {
  getAll: async () => {
    const response = await api.get('/api/providers')
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/providers/${id}`)
    return response.data
  },
  create: async (data: any) => {
    const response = await api.post('/api/providers', data)
    return response.data
  },
  update: async (id: number, data: any) => {
    const response = await api.patch(`/api/providers/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await api.delete(`/api/providers/${id}`)
    return response.data
  },
}

export const authApi = {
  signup: async (data: { name: string; email: string; password: string; phone?: string }) => {
    const response = await api.post('/api/auth/signup', data)
    return response.data
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', data)
    return response.data
  },
}

