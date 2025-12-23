import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      // Redirect to login if needed
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  signup: async (userData) => {
    try {
      const response = await api.post('/api/auth/signup', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Signup failed')
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed')
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/api/auth/profile')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get profile')
    }
  },

  claimProfile: async (sessionId) => {
    try {
      const response = await api.post('/api/auth/claim-profile', { sessionId })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to claim profile')
    }
  }
}

// Analysis API calls
export const analysisAPI = {
  analyzeIdea: async (businessIdea, sessionId = null) => {
    try {
      const response = await api.post('/api/analysis/analyze', {
        businessIdea,
        sessionId
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Analysis failed')
    }
  },

  getSearchHistory: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/analysis/history?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get search history')
    }
  },

  getSearchById: async (searchId) => {
    try {
      const response = await api.get(`/api/analysis/search/${searchId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get search')
    }
  },

  deleteSearch: async (searchId) => {
    try {
      const response = await api.delete(`/api/analysis/search/${searchId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete search')
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/analysis/dashboard/stats')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get dashboard stats')
    }
  }
}

// Legacy support for backward compatibility
export const analyzeBusinessIdea = analysisAPI.analyzeIdea

export const checkServerHealth = async () => {
  try {
    const response = await api.get('/api/health')
    return response.data
  } catch (error) {
    throw new Error('Server health check failed')
  }
}

// Auth utilities
export const authUtils = {
  setAuthData: (token, user) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(user))
  },

  getAuthData: () => {
    const token = localStorage.getItem('authToken')
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    return { token, user }
  },

  clearAuthData: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken')
  }
}

// Session utilities for guest users
export const sessionUtils = {
  getSessionId: () => {
    let sessionId = localStorage.getItem('guestSessionId')
    if (!sessionId) {
      sessionId = 'guest-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('guestSessionId', sessionId)
    }
    return sessionId
  },

  clearSessionId: () => {
    localStorage.removeItem('guestSessionId')
  }
}