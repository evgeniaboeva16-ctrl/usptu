<template>
  <div class="dashboard-home">
    <div class="welcome-section">
      <h1>Добро пожаловать, {{ user.full_name || 'Абитуриент' }}!</h1>
      <p class="subtitle">Личный кабинет абитуриента УГНТУ</p>
    </div>

    <div class="quick-actions">
      <h3 class="section-title">Быстрые действия</h3>
      <div class="actions-grid">
        <router-link to="/dashboard/events" class="action-card">
          <div class="action-icon">📅</div>
          <h4>Мероприятия</h4>
          <p>Запишитесь на мероприятия</p>
        </router-link>
        
        <router-link to="/dashboard/qr" class="action-card">
          <div class="action-icon">📱</div>
          <h4>Мой QR код</h4>
          <p>Покажите на мероприятии</p>
        </router-link>
        
        <router-link to="/dashboard/profile" class="action-card">
          <div class="action-icon">👤</div>
          <h4>Профиль</h4>
          <p>Обновите информацию</p>
        </router-link>
        
        <router-link to="/dashboard/points" class="action-card">
          <div class="action-icon">⭐</div>
          <h4>Баллы</h4>
          <p>Следите за прогрессом</p>
        </router-link>
      </div>
    </div>

    <div class="stats-section">
      <h3 class="section-title">Ваша активность</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎓</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.attendedEvents || 0 }}</div>
            <div class="stat-label">Посещено мероприятий</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalPoints || 0 }}</div>
            <div class="stat-label">Всего баллов</div>
          </div>
        </div>
      </div>
    </div>

    <div class="upcoming-events">
      <div class="section-header">
        <h3 class="section-title">Ближайшие мероприятия</h3>
        <router-link to="/dashboard/events" class="view-all">
          Все мероприятия →
        </router-link>
      </div>
      
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Загружаем мероприятия...</p>
      </div>
      
      <div v-else-if="upcomingEvents.length === 0" class="empty-state">
        <p>Нет предстоящих мероприятий</p>
        <router-link to="/dashboard/events" class="btn-primary">
          Найти мероприятия
        </router-link>
      </div>
      
      <div v-else class="events-grid">
        <div v-for="event in upcomingEvents.slice(0, 3)" :key="event.id" class="event-card">
          <div class="event-date">
            <span class="day">{{ formatDay(event.date) }}</span>
            <span class="month">{{ formatMonth(event.date) }}</span>
          </div>
          <div class="event-content">
            <h4 class="event-title">{{ event.title }}</h4>
            <p class="event-time">{{ event.time }}</p>
            <p class="event-location">{{ event.location }}</p>
            <div class="event-actions">
              <span class="event-points">+{{ event.points }} баллов</span>
              <button 
                v-if="!event.is_registered"
                class="btn-register"
                @click="registerForEvent(event.id)"
              >
                Записаться
              </button>
              <span v-else class="registered-badge">Записан</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="qr-section">
      <div class="qr-content">
        <h3>Ваш QR код готов к использованию</h3>
        <p>Покажите его на мероприятии для быстрой регистрации</p>
        <router-link to="/dashboard/qr" class="btn-qr">
          Открыть QR код →
        </router-link>
      </div>
      <div class="qr-icon">📱</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref({})
const stats = ref({})
const upcomingEvents = ref([])
const loading = ref(false)

onMounted(async () => {
  await Promise.all([
    loadUserData(),
    loadStats(),
    loadUpcomingEvents()
  ])
})

const loadUserData = async () => {
  try {
    const userData = localStorage.getItem('user')
    if (userData) {
      user.value = JSON.parse(userData)
    }
  } catch (error) {
    console.error('Ошибка загрузки данных пользователя:', error)
  }
}

const loadStats = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3001/api/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      stats.value = data.stats || {}
    }
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  }
}

const loadUpcomingEvents = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3001/api/dashboard/events', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Данные из API:', data); // Для отладки

      upcomingEvents.value = (data.events || []).map(event => {
        const eventDateStr = event.event_date; // "2025-12-26"
        const eventTimeStr = event.event_time; // "18:00"

        // Создаем строку полной даты-времени в формате ISO
        const fullDateTime = eventDateStr && eventTimeStr 
          ? `${eventDateStr}T${eventTimeStr}:00.000Z` 
          : event.start_datetime; // "2025-12-26T13:00:00.000Z"

        return {
          id: event.id,
          title: event.title,
          description: event.short_description || event.description || '',
          date: fullDateTime,
          time: eventTimeStr || formatTime(fullDateTime),
          location: event.location || event.address || 'Онлайн',
          points: event.points || 10,
          is_registered: event.is_registered || false,
          category: event.category || 'Общее',
        };
      });
    }
  } catch (error) {
    console.error('Ошибка загрузки мероприятий:', error);
  } finally {
    loading.value = false;
  }
}

const formatDay = (dateString) => {
  return new Date(dateString).getDate()
}

const formatMonth = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', { month: 'short' })
}
const formatTime = (datetime) => {
  if (!datetime) return '';
  const date = new Date(datetime);
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
};
const registerForEvent = async (eventId) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3001/api/dashboard/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      alert('Вы успешно записались на мероприятие!')
      loadUpcomingEvents() // Обновляем список
    }
  } catch (error) {
    alert('Ошибка записи на мероприятие')
  }
}
</script>

<style scoped>
.dashboard-home {
  padding: 20px;
}

.welcome-section {
  margin-bottom: 40px;
}

.welcome-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.quick-actions {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(98, 42, 151, 0.15);
  border-color: #622A97;
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.action-card h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.action-card p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

/* Статистика */
.stats-section {
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
  color: #622A97;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.95rem;
}

/* Предстоящие мероприятия */
.upcoming-events {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-all {
  color: #622A97;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.view-all:hover {
  color: #4a1f72;
  text-decoration: underline;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.spinner {
  border: 4px solid rgba(98, 42, 151, 0.1);
  border-left-color: #622A97;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state .btn-primary {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  margin-top: 15px;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.event-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  display: flex;
  overflow: hidden;
  transition: all 0.3s;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.event-date {
  background: linear-gradient(135deg, #622A97, #CB79DA);
  color: white;
  padding: 20px;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.day {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.month {
  font-size: 1rem;
  text-transform: uppercase;
  opacity: 0.9;
}

.event-content {
  padding: 20px;
  flex: 1;
}

.event-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.event-time,
.event-location {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.event-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.event-points {
  color: #FF9800;
  font-weight: 600;
}

.btn-register {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(98, 42, 151, 0.3);
}

.registered-badge {
  background: #E8F5E9;
  color: #2E7D32;
  padding: 6px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

/* QR секция */
.qr-section {
  background: linear-gradient(135deg, #622A97, #CB79DA);
  border-radius: 20px;
  padding: 40px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 30px rgba(98, 42, 151, 0.3);
}

.qr-content {
  flex: 1;
}

.qr-content h3 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.qr-content p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 20px;
}

.btn-qr {
  background: white;
  color: #622A97;
  text-decoration: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-weight: 600;
  display: inline-block;
  transition: all 0.3s;
}

.btn-qr:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.qr-icon {
  font-size: 5rem;
  opacity: 0.3;
}

@media (max-width: 768px) {
  .welcome-section h1 {
    font-size: 2rem;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .qr-section {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .qr-icon {
    order: -1;
  }
}
</style>