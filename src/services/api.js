import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL
})

// Attach auth token if it exists.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrismart_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const loginUser = (data) => api.post('/auth/login', data)

export const registerUser = (data) => api.post('/auth/register', data)

export const getCropRecommendations = (farmData) =>
  api.post('/recommendations', farmData)

export const getSmartRecommendations = (farmData) =>
  api.post('/smart-recommendations', farmData)

export const getWeatherInsights = (payload) => api.post('/weather', payload)

