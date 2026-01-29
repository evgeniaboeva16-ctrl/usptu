<template>
  <div class="events-page">
    <div class="page-header">
      <h2>Предстоящие мероприятия</h2>
      <p>Записывайтесь на интересующие вас события</p>
    </div>

    <div class="events-filters">
      <div class="filter-group">
        <label>Категория:</label>
        <select v-model="selectedCategory" @change="filterEvents">
          <option value="">Все категории</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Дата:</label>
        <select v-model="selectedDate" @change="filterEvents">
          <option value="">Все даты</option>
          <option value="upcoming">Предстоящие</option>
          <option value="today">Сегодня</option>
          <option value="week">На этой неделе</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка мероприятий...</p>
    </div>

    <div v-else-if="filteredEvents.length === 0" class="empty-state">
      <p>Нет доступных мероприятий</p>
    </div>

    <div v-else class="events-grid">
      <div v-for="event in filteredEvents" :key="event.id" class="event-card">
        <div class="event-header">
          <span class="event-category">{{ event.category }}</span>
          <span class="event-date">{{ formatDate(event.date) }}</span>
        </div>
        
        <h3 class="event-title">{{ event.title }}</h3>
        
        <p class="event-description">{{ event.description }}</p>
        
        <div class="event-details">
          <div class="detail-item">
            <span class="detail-icon">🕒</span>
            <span>{{ event.time }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-icon">📍</span>
            <span>{{ event.location }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-icon">⭐</span>
            <span>{{ event.points }} баллов</span>
          </div>
        </div>
        
        <div class="event-actions">
          <button 
            v-if="event.is_registered" 
            class="btn-registered"
            disabled
          >
            Записан
          </button>
          <button 
            v-else 
            class="btn-register"
            @click="registerForEvent(event.id)"
          >
            Записаться
          </button>
          
          <button 
            class="btn-details"
            @click="showEventDetails(event)"
          >
            Подробнее
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const events = ref([])
const filteredEvents = ref([])
const categories = ref([])
const selectedCategory = ref('')
const selectedDate = ref('')
const loading = ref(false)

onMounted(async () => {
  await loadEvents()
})

const loadEvents = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3001/api/dashboard/events', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('Данные API в EventsPage:', data) // Для отладки
      
      events.value = (data.events || []).map(event => {
        const startDate = event.dates?.start || 
                         event.start_datetime || 
                         event.date || 
                         event.event_date;
        
        return {
          id: event.id,
          title: event.title,
          description: event.short_description || event.description || '',
          date: startDate,
          time: event.event_time || formatTime(startDate), // Используем event_time или форматируем
          location: event.location || event.online_link || event.address || 'Онлайн',
          points: event.points || 10,
          is_registered: event.is_registered || false,
          category: event.category || 'Общее',
          participants_count: event.participants_count || 0,
          max_participants: event.max_participants
        };
      });
      
      filteredEvents.value = events.value // Копируем преобразованные данные
      
      categories.value = [...new Set(events.value.map(e => e.category))]
    }
  } catch (error) {
    console.error('Ошибка загрузки мероприятий:', error)
  } finally {
    loading.value = false
  }
}

const filterEvents = () => {
  let result = [...events.value]
  
  if (selectedCategory.value) {
    result = result.filter(e => e.category === selectedCategory.value)
  }
  
  if (selectedDate.value) {
    const today = new Date()
    switch (selectedDate.value) {
      case 'today':
        result = result.filter(e => new Date(e.date).toDateString() === today.toDateString())
        break
      case 'week':
        const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        result = result.filter(e => {
          const eventDate = new Date(e.date)
          return eventDate >= today && eventDate <= weekLater
        })
        break
      case 'upcoming':
        result = result.filter(e => new Date(e.date) >= today)
        break
    }
  }
  
  filteredEvents.value = result
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

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
      await loadEvents() // Перезагружаем список
    }
  } catch (error) {
    alert('Ошибка записи на мероприятие')
  }
}

const showEventDetails = (event) => {
  // Можно открыть модальное окно с деталями
  console.log('Детали мероприятия:', event)
}
</script>

<style scoped>
.events-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 40px;
}

.page-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-header p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.events-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}

.filter-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

.filter-group select {
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23622A97' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  padding-right: 40px;
}

.filter-group select:focus {
  outline: none;
  border-color: #622A97;
  box-shadow: 0 0 0 3px rgba(98, 42, 151, 0.1);
}

/* Состояния загрузки */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.loading-state .spinner {
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

.empty-state p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

/* Сетка мероприятий */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

/* Карточка мероприятия */
.event-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(98, 42, 151, 0.15);
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #622A97, #CB79DA);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.event-category {
  background: #f0e6f7;
  color: #622A97;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
}

.event-date {
  color: #666;
  font-weight: 500;
}

.event-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.4;
}

.event-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
  font-size: 0.95rem;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #555;
  font-size: 0.9rem;
}

.detail-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.event-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.btn-register,
.btn-registered,
.btn-details {
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  flex: 1;
}

.btn-register {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(98, 42, 151, 0.3);
}

.btn-registered {
  background: #e0e0e0;
  color: #666;
  cursor: not-allowed;
}

.btn-details {
  background: white;
  color: #622A97;
  border: 2px solid #622A97;
}

.btn-details:hover {
  background: #f9f7ff;
}

/* Адаптивность */
@media (max-width: 768px) {
  .events-page {
    padding: 15px;
  }
  
  .page-header h2 {
    font-size: 1.8rem;
  }
  
  .events-filters {
    flex-direction: column;
    gap: 15px;
  }
  
  .filter-group {
    min-width: 100%;
  }
  
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .event-card {
    padding: 20px;
  }
  
  .event-title {
    font-size: 1.2rem;
  }
  
  .event-actions {
    flex-direction: column;
  }
  
  .btn-register,
  .btn-registered,
  .btn-details {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-header h2 {
    font-size: 1.6rem;
  }
  
  .page-header p {
    font-size: 1rem;
  }
  
  .event-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .event-description {
    font-size: 0.9rem;
  }
}
</style>