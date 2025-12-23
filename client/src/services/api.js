import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const analyzeBusinessIdea = async (idea) => {
  try {
    const response = await api.post('/analyze-idea', { idea })
    return response.data
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.error || 'Server error occurred')
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to server. Please check if the server is running.')
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred')
    }
  }
}

export const checkServerHealth = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    throw new Error('Server health check failed')
  }
}