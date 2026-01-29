
export const API_URLS = {
  EVENTS: '/events',
  EVENT_BY_ID: (id) => `/events/${id}`,
  EVENT_PARTICIPANTS: (id) => `/events/${id}/participants`,
  EVENT_MATERIALS: (id) => `/events/${id}/materials`,
  EVENT_FEEDBACK: (id) => `/events/${id}/feedback`,
  
  STATS: '/stats',
  MONTHLY_STATS: '/stats/monthly',
  
  FEEDBACK: '/feedback',
  FEEDBACK_BY_ID: (id) => `/feedback/${id}`,
  
  REPORTS: '/reports',
  EXPORT: (type) => `/export/${type}`,
  
  FACULTIES: '/faculties',
  SETTINGS: '/settings',
  
  UPLOAD: '/upload',
  VERIFY: '/verify'
}

export const ERROR_MESSAGES = {
  NO_TOKEN: 'Требуется авторизация',
  NOT_SPECIALIST: 'Доступ разрешен только для специалистов',
  SERVER_ERROR: 'Ошибка сервера. Пожалуйста, попробуйте позже.',
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  VALIDATION_ERROR: 'Ошибка валидации данных',
  NOT_FOUND: 'Ресурс не найден'
}

export const SUCCESS_MESSAGES = {
  EVENT_CREATED: 'Мероприятие успешно создано',
  EVENT_UPDATED: 'Мероприятие успешно обновлено',
  EVENT_DELETED: 'Мероприятие удалено',
  MATERIAL_UPLOADED: 'Материал успешно загружен',
  ATTENDANCE_MARKED: 'Посещение отмечено',
  FEEDBACK_REPLIED: 'Ответ отправлен'
}