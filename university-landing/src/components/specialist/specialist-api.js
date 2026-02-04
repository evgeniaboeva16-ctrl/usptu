import axios from 'axios'

const specialistApi = axios.create({
  baseURL: 'http://localhost:3001/api/specialist',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

specialistApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    const userEmail = localStorage.getItem('user_email')
    if (userEmail !== 'elisonkein@yahoo.com') {
      console.warn('Пользователь не является специалистом')
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

specialistApi.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Ошибка авторизации')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('user_email')
          window.location.href = '/'
          break
        case 403:
          console.error('Доступ запрещен. Только для специалистов.')
          alert('Доступ разрешен только для специалистов УГНТУ')
          window.location.href = '/'
          break
        case 404:
          console.error('Ресурс не найден')
          break
        case 500:
          console.error('Ошибка сервера')
          break
        default:
          console.error('Произошла ошибка:', error.response.status)
      }
    } else if (error.request) {
      console.error('Нет ответа от сервера')
      alert('Ошибка соединения с сервера. Пожалуйста, проверьте интернет-соединение.')
    } else {
      console.error('Ошибка настройки запроса:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export const specialistService = {
  checkSpecialistAccess: () => {
    return specialistApi.get('/verify')
  },
  
  getStats: () => {
    return specialistApi.get('/stats')
  },
  
  getEvents: (params = {}) => {
    return specialistApi.get('/events', { params })
  },
  
  getUpcomingEvents: () => {
    return specialistApi.get('/events/upcoming')
  },
  
  createEvent: (eventData) => {
    return specialistApi.post('/events', eventData)
  },
  
  updateEvent: (eventId, eventData) => {
    return specialistApi.put(`/events/${eventId}`, eventData)
  },
  
  deleteEvent: (eventId) => {
    return specialistApi.delete(`/events/${eventId}`)
  },
  
  duplicateEvent: (eventId) => {
    return specialistApi.post('/events/duplicate', { event_id: eventId })
  },
  
  getEventMaterials: (eventId) => {
    return specialistApi.get(`/events/${eventId}/materials`)
  },
  
  getFeedback: (params = {}) => {
    return specialistApi.get('/feedback', { params })
  },
  
  getAnalytics: (params = {}) => {
    return specialistApi.get('/analytics/events', { params })
  }
}

export const exportData = (type, params = {}) => {
  return specialistApi.get(`/export/${type}`, {
    params,
    responseType: 'blob'
  })
}

export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export default specialistService