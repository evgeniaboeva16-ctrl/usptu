<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ event ? 'Редактирование мероприятия' : 'Создание мероприятия' }}</h2>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-form">
        <!-- Основная информация -->
        <div class="form-section">
          <h3>Основная информация</h3>
          
          <div class="form-group">
            <label for="title">Название мероприятия</label>
            <input 
              id="title" 
              v-model="formData.title" 
              type="text" 
              required 
              placeholder="Введите название"
            >
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="type">Формат</label>
              <select id="type" v-model="formData.type" required @change="updateLocationFields">
                <option value="">Выберите формат</option>
                <option value="online">Онлайн</option>
                <option value="offline">Офлайн</option>
                <option value="hybrid">Гибрид</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="format">Тип мероприятия</label>
              <select id="format" v-model="formData.format" required>
                <option value="">Выберите тип</option>
                <option value="master_class">Мастер-класс</option>
                <option value="excursion">Экскурсия</option>
                <option value="open_day">День открытых дверей</option>
                <option value="olympiad">Олимпиада</option>
                <option value="workshop">Воркшоп</option>
                <option value="lecture">Лекция</option>
                <option value="consultation">Консультация</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="category">Категория</label>
            <input 
              id="category" 
              v-model="formData.category" 
              type="text" 
              required
              placeholder="Например: IT, Творчество, Наука"
            >
          </div>
          
          <div class="form-group">
            <label for="short_description">Краткое описание</label>
            <textarea 
              id="short_description" 
              v-model="formData.short_description" 
              rows="2"
              required
              placeholder="Краткое описание для карточки мероприятия (до 500 символов)"
              maxlength="500"
            ></textarea>
            <div class="char-count">{{ formData.short_description?.length || 0 }}/500</div>
          </div>
          
          <div class="form-group">
            <label for="description">Полное описание</label>
            <textarea 
              id="description" 
              v-model="formData.description" 
              rows="4"
              placeholder="Подробное описание мероприятия"
            ></textarea>
          </div>
        </div>
        
        <!-- Даты и время -->
        <div class="form-section">
          <h3>Даты и время</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="start_datetime">Дата и время начала</label>
              <input 
                id="start_datetime" 
                v-model="formData.start_datetime" 
                type="datetime-local" 
                required
                :min="minStartDateTime"
              >
              <div v-if="timeError" class="error-message">{{ timeError }}</div>
            </div>
            
            <div class="form-group">
              <label for="end_datetime">Дата и время окончания</label>
              <input 
                id="end_datetime" 
                v-model="formData.end_datetime" 
                type="datetime-local" 
                required
                :min="formData.start_datetime"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="registration_start">Начало регистрации</label>
              <input 
                id="registration_start" 
                v-model="formData.registration_start" 
                type="datetime-local"
              >
            </div>
            
            <div class="form-group">
              <label for="registration_end">Окончание регистрации</label>
              <input 
                id="registration_end" 
                v-model="formData.registration_end" 
                type="datetime-local"
                :min="formData.registration_start"
              >
            </div>
          </div>
        </div>
        
        <!-- Локация -->
        <div class="form-section">
          <h3>Место проведения</h3>
          
          <div class="form-group">
            <label for="location_type">Тип локации</label>
            <select id="location_type" v-model="formData.location_type">
              <option value="">Выберите тип</option>
              <option value="university">Университет</option>
              <option value="partner">Площадка партнера</option>
              <option value="online">Онлайн</option>
            </select>
          </div>
          
          <div v-if="showAddressField" class="form-group">
            <label for="address">Адрес</label>
            <input 
              id="address" 
              v-model="formData.address" 
              type="text" 
              :required="showAddressField"
              placeholder="Введите адрес"
            >
          </div>
          
          <div v-if="showOnlineField" class="form-group">
            <label for="online_link">Ссылка для онлайн-участия</label>
            <input 
              id="online_link" 
              v-model="formData.online_link" 
              type="url" 
              :required="showOnlineField"
              placeholder="https://..."
              pattern="https?://.+"
            >
          </div>
        </div>
        
        <!-- Участники и бюджет -->
        <div class="form-section">
          <h3>Участники и бюджет</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="max_participants">Максимальное количество участников</label>
              <input 
                id="max_participants" 
                v-model="formData.max_participants" 
                type="number" 
                min="0"
                placeholder="0 = без ограничений"
                @input="validateParticipants"
              >
              <div v-if="participantsError" class="error-message">{{ participantsError }}</div>
            </div>
            
            <div class="form-group">
              <label for="min_participants">Минимальное количество участников</label>
              <input 
                id="min_participants" 
                v-model="formData.min_participants" 
                type="number" 
                min="1"
                placeholder="1"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="budget">Бюджет (руб.)</label>
              <input 
                id="budget" 
                v-model="formData.budget" 
                type="number" 
                step="0.01"
                min="0"
                placeholder="0.00"
              >
            </div>
            
            <div class="form-group">
              <label for="cost_per_participant">Стоимость участия (руб.)</label>
              <input 
                id="cost_per_participant" 
                v-model="formData.cost_per_participant" 
                type="number" 
                step="0.01"
                min="0"
                placeholder="0.00 = бесплатно"
              >
            </div>
          </div>
        </div>
        
        <!-- Дополнительно -->
        <div class="form-section">
          <h3>Дополнительно</h3>
          
          <div class="form-group">
            <label for="status">Статус</label>
            <select id="status" v-model="formData.status" required>
              <option value="draft">Черновик</option>
              <option value="published">Опубликовано</option>
              <option value="registration_open">Регистрация открыта</option>
              <option value="registration_closed">Регистрация закрыта</option>
              <option value="active">В процессе</option>
              <option value="completed">Завершено</option>
              <option value="cancelled">Отменено</option>
              <option value="archived">Архив</option>
            </select>
          </div>
        </div>
        
        <!-- Кнопки -->
        <div class="modal-actions">
          <button type="button" @click="$emit('close')" class="cancel-btn">Отмена</button>
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            <span v-if="isSubmitting">⏳</span>
            {{ event ? 'Сохранить изменения' : 'Создать мероприятие' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  event: Object
})

const emit = defineEmits(['save', 'close'])

// Данные формы
const formData = ref({
  title: '',
  type: '',
  format: '',
  short_description: '',
  description: '',
  category: '',
  start_datetime: '',
  end_datetime: '',
  registration_start: '',
  registration_end: '',
  location_type: '',
  address: '',
  online_link: '',
  max_participants: null,
  min_participants: 1,
  budget: null,
  cost_per_participant: null,
  status: 'draft'
})

// Состояния
const isSubmitting = ref(false)
const timeError = ref('')
const participantsError = ref('')

// Функция сброса формы
const resetForm = () => {
  formData.value = {
    title: '',
    type: '',
    format: '',
    short_description: '',
    description: '',
    category: '',
    start_datetime: '',
    end_datetime: '',
    registration_start: '',
    registration_end: '',
    location_type: '',
    address: '',
    online_link: '',
    max_participants: null,
    min_participants: 1,
    budget: null,
    cost_per_participant: null,
    status: 'draft'
  }
}

const showAddressField = computed(() => {
  return formData.value.type === 'offline' || formData.value.type === 'hybrid'
})

const showOnlineField = computed(() => {
  return formData.value.type === 'online' || formData.value.type === 'hybrid'
})

const minStartDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
})

watch(() => props.event, (newEvent) => {
  if (newEvent) {
    const eventCopy = { ...newEvent }
    
    const formatForDateTimeLocal = (dateString) => {
      if (!dateString) return ''
      try {
        const date = new Date(dateString)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        return date.toISOString().slice(0, 16)
      } catch (e) {
        return ''
      }
    }
    
    const dateFields = ['start_datetime', 'end_datetime', 'registration_start', 'registration_end']
    dateFields.forEach(field => {
      if (eventCopy[field]) {
        eventCopy[field] = formatForDateTimeLocal(eventCopy[field])
      }
    })
    
    formData.value = {
      title: eventCopy.title || '',
      type: eventCopy.type || '',
      format: eventCopy.format || '',
      short_description: eventCopy.short_description || '',
      description: eventCopy.description || '',
      category: eventCopy.category || '',
      start_datetime: eventCopy.start_datetime || '',
      end_datetime: eventCopy.end_datetime || '',
      registration_start: eventCopy.registration_start || '',
      registration_end: eventCopy.registration_end || '',
      location_type: eventCopy.location_type || '',
      address: eventCopy.address || '',
      online_link: eventCopy.online_link || '',
      max_participants: eventCopy.max_participants || null,
      min_participants: eventCopy.min_participants || 1,
      budget: eventCopy.budget || null,
      cost_per_participant: eventCopy.cost_per_participant || null,
      status: eventCopy.status || 'draft'
    }
  } else {
    // Сброс формы для создания
    resetForm()
  }
}, { immediate: true })

// Методы
const updateLocationFields = () => {
  // Сбрасываем поля локации при изменении типа
  if (formData.value.type === 'online') {
    formData.value.address = ''
  } else if (formData.value.type === 'offline') {
    formData.value.online_link = ''
  }
}

const validateParticipants = () => {
  if (formData.value.max_participants && formData.value.max_participants < 0) {
    participantsError.value = 'Количество участников не может быть отрицательным'
    formData.value.max_participants = null
  } else if (formData.value.max_participants === 0) {
    participantsError.value = '0 означает без ограничений'
  } else {
    participantsError.value = ''
  }
}

const validateTimes = () => {
  timeError.value = ''
  
  if (!formData.value.start_datetime || !formData.value.end_datetime) {
    return true
  }
  
  const start = new Date(formData.value.start_datetime)
  const end = new Date(formData.value.end_datetime)
  
  if (start >= end) {
    timeError.value = 'Дата начала должна быть раньше даты окончания'
    return false
  }
  
  // Проверяем, чтобы мероприятие не было в прошлом (кроме черновиков)
  if (formData.value.status !== 'draft' && start < new Date()) {
    timeError.value = 'Мероприятие не может начинаться в прошлом'
    return false
  }
  
  return true
}

const validateRegistrationDates = () => {
  if (formData.value.registration_start && formData.value.registration_end) {
    const regStart = new Date(formData.value.registration_start)
    const regEnd = new Date(formData.value.registration_end)
    const eventStart = new Date(formData.value.start_datetime)
    
    if (regStart >= regEnd) {
      timeError.value = 'Дата начала регистрации должна быть раньше даты окончания'
      return false
    }
    
    if (regEnd > eventStart) {
      timeError.value = 'Регистрация должна заканчиваться до начала мероприятия'
      return false
    }
  }
  return true
}

const validateRequiredFields = () => {
  const requiredFields = [
    'title', 'type', 'format', 'short_description', 'category',
    'start_datetime', 'end_datetime', 'status'
  ]
  
  for (const field of requiredFields) {
    if (!formData.value[field] || formData.value[field].toString().trim() === '') {
      alert(`Пожалуйста, заполните обязательное поле: ${getFieldLabel(field)}`)
      return false
    }
  }
  
  // Проверка полей локации в зависимости от типа
  if (showAddressField.value && !formData.value.address) {
    alert('Пожалуйста, укажите адрес мероприятия')
    return false
  }
  
  if (showOnlineField.value && !formData.value.online_link) {
    alert('Пожалуйста, укажите ссылку для онлайн-участия')
    return false
  }
  
  return true
}

const getFieldLabel = (field) => {
  const labels = {
    title: 'Название',
    type: 'Формат',
    format: 'Тип мероприятия',
    short_description: 'Краткое описание',
    category: 'Категория',
    start_datetime: 'Дата начала',
    end_datetime: 'Дата окончания',
    status: 'Статус'
  }
  return labels[field] || field
}

// Обработка отправки формы
const handleSubmit = () => {
  if (isSubmitting.value) return
  
  // Сброс ошибок
  timeError.value = ''
  participantsError.value = ''
  
  // Валидация
  if (!validateRequiredFields()) return
  if (!validateTimes()) return
  if (!validateRegistrationDates()) return
  
  isSubmitting.value = true
  
  try {
    const eventData = { ...formData.value }
    
    const numericFields = ['max_participants', 'min_participants', 'budget', 'cost_per_participant']
    numericFields.forEach(field => {
      if (eventData[field] !== null && eventData[field] !== undefined && eventData[field] !== '') {
        eventData[field] = parseFloat(eventData[field])
      } else {
        eventData[field] = null
      }
    })
    
    if (!eventData.min_participants || eventData.min_participants < 1) {
      eventData.min_participants = 1
    }
    
    if (eventData.type === 'online') {
      eventData.address = null
    } else if (eventData.type === 'offline') {
      eventData.online_link = null
    }
    
    emit('save', eventData)
  } catch (error) {
    console.error('Ошибка при подготовке данных:', error)
    alert('Произошла ошибка при подготовке данных. Пожалуйста, проверьте введенные значения.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  background: linear-gradient(135deg, #622A97, #CB79DA);
  border-radius: 20px 20px 0 0;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header h2 {
  margin: 0;
  font-size: 22px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-form {
  padding: 30px;
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.form-group label::after {
  content: ' *';
  color: #ff4757;
  opacity: 0.6;
}

.form-group input:not([type="checkbox"]):not([type="radio"]),
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #eaeaea;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s;
  box-sizing: border-box;
  background: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #622A97;
  box-shadow: 0 0 0 3px rgba(98, 42, 151, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.error-message {
  color: #ff4757;
  font-size: 12px;
  margin-top: 5px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #eaeaea;
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 5;
}

.cancel-btn {
  background: #f5f7fa;
  color: #666;
  border: 1px solid #eaeaea;
  padding: 12px 30px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #eaeaea;
}

.submit-btn {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(98, 42, 151, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    max-height: 95vh;
  }
  
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .modal-form {
    padding: 20px;
  }
}

/* Стили для обязательных полей */
input:required, select:required, textarea:required {
  border-left: 3px solid #ff4757;
}

/* Стили для невалидных полей */
input:invalid, select:invalid, textarea:invalid {
  border-color: #ff4757;
}

/* Убрать стандартный стиль для datetime-local */
input[type="datetime-local"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  background-color: #622A97;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}
</style>