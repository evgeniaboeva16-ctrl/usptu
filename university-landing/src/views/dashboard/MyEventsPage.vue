<template>
  <div class="my-events-page">
    <div class="page-header">
      <h2>Мои мероприятия</h2>
      <p>История посещенных мероприятий</p>
    </div>

    <!-- Фильтры -->
    <div class="events-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-btn', { 'active': activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
        <span class="tab-count">{{ getTabCount(tab.id) }}</span>
      </button>
    </div>

    <!-- Состояния загрузки -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Загружаем ваши мероприятия...</p>
    </div>

    <div v-else-if="!hasEvents" class="empty-state">
      <div class="empty-icon">📅</div>
      <h3>Мероприятий пока нет</h3>
      <p>Запишитесь на мероприятия, чтобы они появились здесь</p>
      <button class="btn-primary" @click="goToEvents">
        Посмотреть мероприятия
      </button>
    </div>

    <!-- Список мероприятий -->
    <div v-else class="events-container">
      <!-- Посещенные мероприятия -->
      <div v-if="activeTab === 'attended' && attendedEvents.length > 0" class="events-section">
        <h3 class="section-title">Посещенные мероприятия</h3>
        <div class="events-list">
          <div v-for="event in attendedEvents" :key="event.id" class="event-item attended">
            <div class="event-icon">✅</div>
            <div class="event-content">
              <div class="event-header">
                <h4 class="event-title">{{ event.title }}</h4>
                <span class="event-date">{{ formatDate(event.date) }}</span>
              </div>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-meta">
                <span class="meta-item">
                  <span class="meta-icon">📍</span>
                  {{ event.location }}
                </span>
                <span class="meta-item">
                  <span class="meta-icon">⭐</span>
                  +{{ event.points }} баллов
                </span>
                <span class="meta-item">
                  <span class="meta-icon">🕒</span>
                  {{ formatTime(event.scanned_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Предстоящие мероприятия -->
      <div v-if="activeTab === 'upcoming' && upcomingEvents.length > 0" class="events-section">
        <h3 class="section-title">Предстоящие мероприятия</h3>
        <div class="events-list">
          <div v-for="event in upcomingEvents" :key="event.id" class="event-item upcoming">
            <div class="event-icon">📅</div>
            <div class="event-content">
              <div class="event-header">
                <h4 class="event-title">{{ event.title }}</h4>
                <span class="event-date">{{ formatDate(event.date) }}</span>
              </div>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-meta">
                <span class="meta-item">
                  <span class="meta-icon">📍</span>
                  {{ event.location }}
                </span>
                <span class="meta-item">
                  <span class="meta-icon">🕒</span>
                  {{ event.time }}
                </span>
                <span class="meta-item">
                  <span class="meta-icon">👥</span>
                  {{ event.participants_count }}/{{ event.max_participants }}
                </span>
              </div>
              <button class="btn-cancel" @click="cancelRegistration(event.id)">
                Отменить запись
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Прошедшие мероприятия (где не был) -->
      <div v-if="activeTab === 'past' && pastEvents.length > 0" class="events-section">
        <h3 class="section-title">Прошедшие мероприятия</h3>
        <div class="events-list">
          <div v-for="event in pastEvents" :key="event.id" class="event-item past">
            <div class="event-icon">⏰</div>
            <div class="event-content">
              <div class="event-header">
                <h4 class="event-title">{{ event.title }}</h4>
                <span class="event-date">{{ formatDate(event.date) }}</span>
              </div>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-status">
                <span v-if="event.attended" class="status-badge attended">Вы посетили</span>
                <span v-else class="status-badge missed">Вы не посетили</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Состояния
const events = ref([])
const loading = ref(false)
const activeTab = ref('attended')

// Табы
const tabs = [
  { id: 'attended', label: 'Посещенные' },
  { id: 'upcoming', label: 'Предстоящие' },
  { id: 'past', label: 'Прошедшие' }
]

// Вычисляемые свойства
const attendedEvents = computed(() => {
  return events.value.filter(event => event.attended)
})

const upcomingEvents = computed(() => {
  const today = new Date()
  return events.value.filter(event => 
    !event.attended && new Date(event.date) >= today
  )
})

const pastEvents = computed(() => {
  const today = new Date()
  return events.value.filter(event => 
    !event.attended && new Date(event.date) < today
  )
})

const hasEvents = computed(() => {
  return events.value.length > 0
})

// Методы
const getTabCount = (tabId) => {
  switch(tabId) {
    case 'attended': return attendedEvents.value.length
    case 'upcoming': return upcomingEvents.value.length
    case 'past': return pastEvents.value.length
    default: return 0
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goToEvents = () => {
  router.push('/dashboard/events')
}

const cancelRegistration = async (eventId) => {
  if (!confirm('Вы уверены, что хотите отменить запись на мероприятие?')) {
    return
  }
  
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3001/api/dashboard/events/${eventId}/cancel`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      alert('Запись на мероприятие отменена')
      loadEvents()
    }
  } catch (error) {
    console.error('Ошибка отмены записи:', error)
    alert('Не удалось отменить запись')
  }
}

const loadEvents = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3001/api/dashboard/my-events', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      events.value = data.events?.all || []
    }
  } catch (error) {
    console.error('Ошибка загрузки мероприятий:', error)
  } finally {
    loading.value = false
  }
}

// Жизненный цикл
onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.my-events-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

/* Табы */
.events-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background: none;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.tab-btn:hover {
  background: #f5f5f5;
}

.tab-btn.active {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.9rem;
}

/* Состояния */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
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

.empty-state .empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin-bottom: 20px;
}

.btn-primary {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(98, 42, 151, 0.3);
}

/* Секции мероприятий */
.events-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

/* Список мероприятий */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.event-item {
  display: flex;
  gap: 20px;
  padding: 25px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.event-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.event-item.attended {
  border-left: 5px solid #4CAF50;
}

.event-item.upcoming {
  border-left: 5px solid #2196F3;
}

.event-item.past {
  border-left: 5px solid #9E9E9E;
}

.event-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.event-content {
  flex: 1;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.event-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.event-date {
  color: #666;
  font-weight: 500;
  white-space: nowrap;
  margin-left: 20px;
}

.event-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.event-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #555;
  font-size: 0.9rem;
}

.meta-icon {
  font-size: 1rem;
}

.event-status {
  margin-top: 15px;
}

.status-badge {
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-badge.attended {
  background: #E8F5E9;
  color: #2E7D32;
}

.status-badge.missed {
  background: #FFEBEE;
  color: #C62828;
}

.btn-cancel {
  background: #FFEBEE;
  color: #C62828;
  border: 1px solid #FFCDD2;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.btn-cancel:hover {
  background: #FFCDD2;
}

@media (max-width: 768px) {
  .page-header h2 {
    font-size: 1.6rem;
  }
  
  .events-tabs {
    flex-wrap: wrap;
  }
  
  .event-item {
    flex-direction: column;
    gap: 15px;
  }
  
  .event-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .event-date {
    margin-left: 0;
  }
  
  .event-meta {
    flex-direction: column;
    gap: 10px;
  }
}
</style>