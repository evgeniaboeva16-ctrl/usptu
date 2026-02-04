<template>
  <div class="dashboard-page">
    <!-- Статистика -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalEvents }}</div>
          <div class="stat-label">Мероприятий всего</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalParticipants }}</div>
          <div class="stat-label">Участников</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.upcomingEvents }}</div>
          <div class="stat-label">Предстоящих</div>
        </div>
      </div>
    </div>

    <!-- Ближайшие мероприятия -->
    <div class="section">
      <div class="section-header">
        <h2>Ближайшие мероприятия</h2>
        <router-link to="/specialist/events" class="view-all-link">
          Все мероприятия →
        </router-link>
      </div>
      
      <div class="events-list">
        <div v-for="event in upcomingEvents" :key="event.id" class="event-card">
          <div class="event-date">
            <div class="event-day">{{ formatDay(event.start_datetime) }}</div>
            <div class="event-month">{{ formatMonth(event.start_datetime) }}</div>
          </div>
          <div class="event-details">
            <h3 class="event-title">{{ event.title }}</h3>
            <p class="event-time">⏰ {{ formatTime(event.start_datetime) }}</p>
            <p class="event-location">📍 {{ event.location_type === 'online' ? 'Онлайн' : event.address }}</p>
            <div class="event-meta">
              <span class="participants">👥 {{ event.current_participants }}/{{ event.max_participants || '∞' }}</span>
              <span :class="['status', event.status]">{{ formatStatus(event.status) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Быстрые действия -->
    <div class="quick-actions">
      <h2>Быстрые действия</h2>
      <div class="actions-grid">
        <button @click="createEvent" class="action-card">
          <div class="action-icon">➕</div>
          <h3>Создать мероприятие</h3>
          <p>Добавить новое событие в систему</p>
        </button>
        
        <button @click="viewAnalytics" class="action-card">
          <div class="action-icon">📈</div>
          <h3>Аналитика</h3>
          <p>Посмотреть статистику и отчеты</p>
        </button>
        
        <button @click="checkFeedback" class="action-card">
          <div class="action-icon">💬</div>
          <h3>Отзывы</h3>
          <p>Просмотр обратной связи</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Статистика
const stats = ref({
  totalEvents: 0,
  totalParticipants: 0,
  upcomingEvents: 0,
  avgRating: 0
})

// Ближайшие мероприятия
const upcomingEvents = ref([])

// Форматирование даты
const formatDay = (dateString) => {
  return new Date(dateString).getDate()
}

const formatMonth = (dateString) => {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
  return months[new Date(dateString).getMonth()]
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

const formatStatus = (status) => {
  const statusMap = {
    'draft': 'Черновик',
    'published': 'Опубликовано',
    'registration_open': 'Регистрация открыта',
    'registration_closed': 'Регистрация закрыта',
    'active': 'В процессе',
    'completed': 'Завершено',
    'cancelled': 'Отменено'
  }
  return statusMap[status] || status
}

// Методы
const createEvent = () => {
  router.push('/specialist/events')
}

const viewAnalytics = () => {
  router.push('/specialist/analytics')
}

const manageMaterials = () => {
  alert('Раздел "Материалы" в разработке')
}

const checkFeedback = () => {
  router.push('/specialist/feedback')
}

const editEvent = (event) => {
  router.push(`/specialist/events/edit/${event.id}`)
}

const viewEvent = (event) => {
  router.push(`/specialist/events/${event.id}`)
}

// Загрузка данных
const loadData = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    // Загружаем статистику
    const statsResponse = await fetch('http://localhost:3001/api/specialist/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (statsResponse.ok) {
      const data = await statsResponse.json()
      stats.value = data.stats
    }

    // Загружаем ближайшие мероприятия
    const eventsResponse = await fetch('http://localhost:3001/api/specialist/events/upcoming', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (eventsResponse.ok) {
      const data = await eventsResponse.json()
      upcomingEvents.value = data.events
    }

  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
    // Заглушки для демонстрации
    stats.value = {
      totalEvents: 15,
      totalParticipants: 342,
      upcomingEvents: 3,
      avgRating: 4.7
    }
    
    upcomingEvents.value = [
      {
        id: 1,
        title: 'День открытых дверей',
        start_datetime: new Date(Date.now() + 86400000).toISOString(),
        location_type: 'offline',
        address: 'ул. Первомайская, 14',
        current_participants: 45,
        max_participants: 100,
        status: 'registration_open'
      },
      {
        id: 2,
        title: 'Вебинар по программированию',
        start_datetime: new Date(Date.now() + 172800000).toISOString(),
        location_type: 'online',
        address: 'Zoom',
        current_participants: 89,
        max_participants: 150,
        status: 'published'
      }
    ]
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Статистика */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 40px;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #f9f7ff, #f2eeff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

/* Разделы */
.section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h2 {
  margin: 0;
  font-size: 22px;
  color: #333;
}

.view-all-link {
  color: #622A97;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s;
}

.view-all-link:hover {
  color: #4a1f72;
  transform: translateX(5px);
}

/* Список мероприятий */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.event-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eaeaea;
  transition: all 0.3s;
}

.event-card:hover {
  border-color: #CB79DA;
  box-shadow: 0 5px 15px rgba(98, 42, 151, 0.1);
}

.event-date {
  background: linear-gradient(135deg, #622A97, #CB79DA);
  color: white;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  min-width: 70px;
}

.event-day {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.event-month {
  font-size: 14px;
  text-transform: uppercase;
  opacity: 0.9;
}

.event-details {
  flex: 1;
}

.event-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.event-time, .event-location {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.event-meta {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.participants {
  color: #555;
  font-size: 13px;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status.draft { background: #f0f0f0; color: #666; }
.status.published { background: #e3f2fd; color: #1976d2; }
.status.registration_open { background: #e8f5e9; color: #388e3c; }
.status.registration_closed { background: #fff3e0; color: #f57c00; }
.status.active { background: #e8eaf6; color: #303f9f; }
.status.completed { background: #f3e5f5; color: #7b1fa2; }
.status.cancelled { background: #ffebee; color: #d32f2f; }

.event-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  background: #f5f7fa;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #622A97;
  color: white;
  transform: scale(1.1);
}

/* Быстрые действия */
.quick-actions h2 {
  margin: 0 0 25px 0;
  font-size: 22px;
  color: #333;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 25px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
}

.action-card:hover {
  border-color: #622A97;
  box-shadow: 0 10px 30px rgba(98, 42, 151, 0.1);
  transform: translateY(-5px);
}

.action-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.action-card h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

.action-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .event-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .event-date {
    align-self: flex-start;
  }
  
  .event-actions {
    align-self: flex-end;
    margin-top: 15px;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .section {
    padding: 20px;
  }
}
</style>