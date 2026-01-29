<template>
  <div class="events-management">
    <!-- Заголовок с кнопкой создания -->
    <div class="page-header">
      <h1>Календарь мероприятий</h1>
      <button @click="showCreateModal" class="create-btn">
        <span>➕</span>
        Создать мероприятие
      </button>
    </div>

    <!-- Фильтры и поиск -->
    <div class="filters-section">
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          @input="filterEvents" 
          placeholder="Поиск мероприятий..." 
          type="text"
        >
        <span class="search-icon">🔍</span>
      </div>
      
      <div class="filter-controls">
        <select v-model="statusFilter" @change="filterEvents" class="filter-select">
          <option value="">Все статусы</option>
          <option value="draft">Черновик</option>
          <option value="published">Опубликовано</option>
          <option value="registration_open">Регистрация открыта</option>
          <option value="active">В процессе</option>
          <option value="completed">Завершено</option>
          <option value="cancelled">Отменено</option>
          <option value="archived">Архив</option>
        </select>
        
        <select v-model="typeFilter" @change="filterEvents" class="filter-select">
          <option value="">Все форматы</option>
          <option value="online">Онлайн</option>
          <option value="offline">Офлайн</option>
          <option value="hybrid">Гибрид</option>
        </select>
      </div>
    </div>

    <!-- Таблица мероприятий -->
    <div class="events-table-container">
      <table class="events-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Дата и время</th>
            <th>Формат</th>
            <th>Участники</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in filteredEvents" :key="event.id">
            <td>
              <div class="event-title-cell">
                <strong>{{ event.title }}</strong>
                <small>{{ event.short_description || 'Нет описания' }}</small>
              </div>
            </td>
            <td>
              <div class="event-date-cell">
                <div>{{ formatDate(event.start_datetime) }}</div>
                <div class="time">{{ formatTime(event.start_datetime) }}</div>
              </div>
            </td>
            <td>
              <span :class="['format-badge', event.type]">
                {{ formatType(event.type) }}
              </span>
              <div v-if="event.format" class="format-subtype">
                {{ formatEventFormat(event.format) }}
              </div>
            </td>
            <td>
              <div class="participants-cell">
                <span>{{ event.current_participants || 0 }}/{{ event.max_participants || '∞' }}</span>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: getParticipationPercent(event) + '%' }"></div>
                </div>
              </div>
            </td>
            <td>
              <span :class="['status-badge', event.status]">
                {{ formatStatus(event.status) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="editEvent(event)" class="action-btn" title="Редактировать">✏️</button>
                <button @click="viewEvent(event)" class="action-btn" title="Просмотр">👁️</button>
                <button @click="manageMaterials(event)" class="action-btn" title="Материалы">📁</button>
                <button @click="duplicateEvent(event)" class="action-btn" title="Дублировать">📋</button>
                <button @click="deleteEvent(event)" class="action-btn danger" title="Удалить">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredEvents.length === 0 && !isLoading" class="empty-state">
        <p>Мероприятия не найдены</p>
        <button @click="showCreateModal" class="create-first-btn">Создать первое мероприятие</button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <p>Загрузка мероприятий...</p>
      </div>
    </div>

    <!-- Модальное окно создания/редактирования -->
    <EventModal 
      v-if="showModal"
      :event="editingEvent"
      @save="handleSaveEvent"
      @close="closeModal"
    />

    <!-- Уведомление об ошибке -->
    <div v-if="errorMessage" class="error-notification">
      <p>{{ errorMessage }}</p>
      <button @click="errorMessage = ''" class="close-error">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EventModal from './EventModal.vue'
import specialistService from './specialist-api.js'

const showModal = ref(false)
const editingEvent = ref(null)
const events = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

// Фильтрация мероприятий
const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const matchesSearch = !searchQuery.value || 
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (event.short_description && event.short_description.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const matchesStatus = !statusFilter.value || event.status === statusFilter.value
    const matchesType = !typeFilter.value || event.type === typeFilter.value
    
    return matchesSearch && matchesStatus && matchesType
  }).sort((a, b) => new Date(b.start_datetime) - new Date(a.start_datetime))
})

// Вспомогательные функции
const formatDate = (dateString) => {
  if (!dateString) return 'Не указано'
  try {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (e) {
    return 'Некорректная дата'
  }
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return ''
  }
}

const formatType = (type) => {
  const types = {
    'online': 'Онлайн',
    'offline': 'Офлайн',
    'hybrid': 'Гибрид'
  }
  return types[type] || type || 'Не указано'
}

const formatEventFormat = (format) => {
  const formats = {
    'master_class': 'Мастер-класс',
    'excursion': 'Экскурсия',
    'open_day': 'День открытых дверей',
    'olympiad': 'Олимпиада',
    'workshop': 'Воркшоп',
    'lecture': 'Лекция',
    'consultation': 'Консультация'
  }
  return formats[format] || format || ''
}

const formatStatus = (status) => {
  const statuses = {
    'draft': 'Черновик',
    'published': 'Опубликовано',
    'registration_open': 'Регистрация открыта',
    'registration_closed': 'Регистрация закрыта',
    'active': 'В процессе',
    'completed': 'Завершено',
    'cancelled': 'Отменено',
    'archived': 'Архив'
  }
  return statuses[status] || status || 'Не указано'
}

const getParticipationPercent = (event) => {
  if (!event.max_participants || event.max_participants <= 0) return 0
  const current = event.current_participants || 0
  return Math.min(100, Math.round((current / event.max_participants) * 100))
}

// Основные методы
const showCreateModal = () => {
  editingEvent.value = null
  showModal.value = true
}

const editEvent = (event) => {
  // Копируем объект события
  editingEvent.value = { ...event }
  showModal.value = true
}

const viewEvent = (event) => {
  alert(`Просмотр мероприятия: ${event.title}\nОписание: ${event.description || 'Нет описания'}\nДата: ${formatDate(event.start_datetime)} ${formatTime(event.start_datetime)}`)
  // В будущем: router.push(`/specialist/events/${event.id}`)
}

const manageMaterials = async (event) => {
  try {
    const materials = await specialistService.getEventMaterials(event.id)
    alert(`Материалы мероприятия "${event.title}":\n${materials.count > 0 ? `Найдено ${materials.count} материалов` : 'Материалов нет'}`)
  } catch (error) {
    console.error('Ошибка загрузки материалов:', error)
    alert(`Управление материалами для: ${event.title}\n(Раздел в разработке)`)
  }
}

const duplicateEvent = async (event) => {
  if (confirm(`Создать копию мероприятия "${event.title}"?`)) {
    try {
      await specialistService.duplicateEvent(event.id)
      alert('Мероприятие успешно скопировано!')
      loadEvents()
    } catch (error) {
      console.error('Ошибка копирования:', error)
      errorMessage.value = 'Не удалось скопировать мероприятие. Проверьте подключение.'
    }
  }
}

const deleteEvent = async (event) => {
  if (confirm(`Удалить мероприятие "${event.title}"?`)) {
    try {
      await specialistService.deleteEvent(event.id)
      alert('Мероприятие удалено!')
      loadEvents()
    } catch (error) {
      console.error('Ошибка удаления:', error)
      errorMessage.value = 'Не удалось удалить мероприятие. Проверьте подключение.'
    }
  }
}

const handleSaveEvent = async (eventData) => {
  try {
    if (eventData.id) {
      // Обновление существующего мероприятия
      await specialistService.updateEvent(eventData.id, eventData)
      alert('Мероприятие обновлено!')
    } else {
      // Создание нового мероприятия
      await specialistService.createEvent(eventData)
      alert('Мероприятие создано!')
    }
    closeModal()
    loadEvents()
  } catch (error) {
    console.error('Ошибка сохранения:', error)
    errorMessage.value = 'Ошибка сохранения мероприятия. Проверьте все обязательные поля.'
  }
}

const closeModal = () => {
  showModal.value = false
  editingEvent.value = null
}

const filterEvents = () => {
  // Фильтрация происходит в computed свойстве
}

// Загрузка данных
const loadEvents = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // Проверяем доступ специалиста
    await specialistService.checkSpecialistAccess()
    
    // Загружаем мероприятия
    const response = await specialistService.getEvents()
    events.value = response.events || []
    
    console.log(`✅ Загружено ${events.value.length} мероприятий`)
    
  } catch (error) {
    console.error('Ошибка загрузки мероприятий:', error)
    errorMessage.value = 'Не удалось загрузить мероприятия. Проверьте подключение к серверу.'
    
    // Заглушка для демонстрации
    events.value = [
      {
        id: 1,
        title: 'День открытых дверей УГНТУ',
        short_description: 'Знакомство с университетом',
        description: 'Полное описание дня открытых дверей...',
        start_datetime: new Date(Date.now() + 86400000).toISOString(),
        end_datetime: new Date(Date.now() + 86400000 + 10800000).toISOString(),
        type: 'offline',
        format: 'open_day',
        category: 'Общее',
        current_participants: 45,
        max_participants: 100,
        status: 'registration_open',
        location_type: 'offline',
        address: 'ул. Первомайская, 14'
      },
      {
        id: 2,
        title: 'Вебинар по программированию',
        short_description: 'Основы Python для начинающих',
        description: 'Онлайн-курс по основам программирования...',
        start_datetime: new Date(Date.now() + 172800000).toISOString(),
        end_datetime: new Date(Date.now() + 172800000 + 7200000).toISOString(),
        type: 'online',
        format: 'workshop',
        category: 'IT',
        current_participants: 89,
        max_participants: 150,
        status: 'published',
        location_type: 'online',
        online_link: 'https://zoom.us/j/123456789'
      },
      {
        id: 3,
        title: 'Экскурсия в лабораторию',
        short_description: 'Знакомство с научным оборудованием',
        description: 'Экскурсия по современным лабораториям...',
        start_datetime: new Date(Date.now() - 86400000).toISOString(),
        end_datetime: new Date(Date.now() - 86400000 + 7200000).toISOString(),
        type: 'offline',
        format: 'excursion',
        category: 'Наука',
        current_participants: 25,
        max_participants: 30,
        status: 'completed',
        location_type: 'offline',
        address: 'Лабораторный корпус, ауд. 304'
      }
    ]
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.events-management {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Заголовок страницы */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.create-btn {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(98, 42, 151, 0.4);
}

/* Фильтры */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.search-bar {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 2px solid #eaeaea;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s;
}

.search-bar input:focus {
  outline: none;
  border-color: #622A97;
  box-shadow: 0 0 0 3px rgba(98, 42, 151, 0.1);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.filter-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 10px 15px;
  border: 2px solid #eaeaea;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: #622A97;
}

/* Таблица */
.events-table-container {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  min-height: 300px;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th {
  background: #f9f7ff;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #622A97;
  border-bottom: 2px solid #eaeaea;
}

.events-table td {
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
}

.events-table tr:hover {
  background: #f9f7ff;
}

/* Стили для ячеек */
.event-title-cell strong {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.event-title-cell small {
  color: #666;
  font-size: 12px;
  display: block;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-date-cell {
  font-weight: 500;
  color: #333;
}

.event-date-cell .time {
  color: #666;
  font-size: 12px;
  margin-top: 3px;
}

.format-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 5px;
}

.format-subtype {
  font-size: 11px;
  color: #666;
  margin-top: 2px;
}

.format-badge.online {
  background: #e3f2fd;
  color: #1976d2;
}

.format-badge.offline {
  background: #e8f5e9;
  color: #388e3c;
}

.format-badge.hybrid {
  background: #fff3e0;
  color: #f57c00;
}

.participants-cell {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.progress-bar {
  height: 6px;
  background: #eaeaea;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  border-radius: 3px;
  transition: width 0.3s;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  min-width: 100px;
  text-align: center;
}

.status-badge.draft { background: #f0f0f0; color: #666; }
.status-badge.published { background: #e3f2fd; color: #1976d2; }
.status-badge.registration_open { background: #e8f5e9; color: #388e3c; }
.status-badge.registration_closed { background: #fff3e0; color: #f57c00; }
.status-badge.active { background: #e8eaf6; color: #303f9f; }
.status-badge.completed { background: #f3e5f5; color: #7b1fa2; }
.status-badge.cancelled { background: #ffebee; color: #d32f2f; }
.status-badge.archived { background: #eceff1; color: #546e7a; }

/* Кнопки действий */
.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  background: #f5f7fa;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #622A97;
  color: white;
  transform: scale(1.1);
}

.action-btn.danger:hover {
  background: #ff4757;
}

/* Состояние пустой таблицы */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state p {
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;
}

.create-first-btn {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.create-first-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(98, 42, 151, 0.4);
}

/* Состояние загрузки */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

/* Уведомление об ошибке */
.error-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #ff4757;
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
  z-index: 1000;
  max-width: 400px;
}

.error-notification p {
  margin: 0;
  flex: 1;
}

.close-error {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-error:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 1024px) {
  .events-table-container {
    overflow-x: auto;
  }
  
  .events-table {
    min-width: 900px;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar {
    max-width: 100%;
  }
  
  .filter-controls {
    width: 100%;
  }
  
  .filter-select {
    flex: 1;
  }
  
  .error-notification {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}
</style>