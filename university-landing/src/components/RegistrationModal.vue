<template>
  <!-- Модальное окно регистрации -->
  <div v-if="isVisible" class="registration-modal-overlay" @click.self="closeModal">
    <div class="registration-modal">
      <!-- Заголовок модального окна -->
      <div class="modal-header">
        <div class="modal-title-container">
          <h2 class="modal-title">Регистрация</h2>
        </div>
        <button class="close-btn" @click="closeModal">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M5 5L15 15" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Форма регистрации -->
      <form @submit.prevent="handleSubmit" class="registration-form">
        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">
            Email *
            <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
          </label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            :class="['form-input', { 'error': errors.email }]"
            placeholder="ivanovii@gazprom.ru"
            @blur="validateField('email')"
          >
        </div>

        <div class="form-row">
          <div class="form-group third">
            <label for="lastName" class="form-label">
              Фамилия *
              <span class="error-message" v-if="errors.lastName">{{ errors.lastName }}</span>
            </label>
            <input
              type="text"
              id="lastName"
              v-model="formData.lastName"
              :class="['form-input', { 'error': errors.lastName }]"
              placeholder="Иванов"
              @blur="validateField('lastName')"
            >
          </div>

          <div class="form-group third">
            <label for="firstName" class="form-label">
              Имя *
              <span class="error-message" v-if="errors.firstName">{{ errors.firstName }}</span>
            </label>
            <input
              type="text"
              id="firstName"
              v-model="formData.firstName"
              :class="['form-input', { 'error': errors.firstName }]"
              placeholder="Иван"
              @blur="validateField('firstName')"
            >
          </div>

          <div class="form-group third">
            <label for="middleName" class="form-label">
              Отчество
            </label>
            <input
              type="text"
              id="middleName"
              v-model="formData.middleName"
              class="form-input"
              placeholder="Иванович"
            >
          </div>
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">Телефон</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
            class="form-input"
            placeholder="+7 (999) 123-45-67"
          >
        </div>

        <div class="form-group">
          <label for="school" class="form-label">
            Школа *
            <span class="error-message" v-if="errors.school">{{ errors.school }}</span>
          </label>
          <div class="autocomplete-wrapper">
            <input
              type="text"
              id="school"
              v-model="formData.school"
              :class="['form-input', { 'error': errors.school }]"
              placeholder="Начните вводить название школы"
              @blur="validateField('school')"
              @input="searchSchools"
              autocomplete="off"
            >
            <div v-if="schoolSuggestions.length > 0" class="autocomplete-dropdown">
              <div 
                v-for="suggestion in schoolSuggestions" 
                :key="suggestion.id"
                class="suggestion-item"
                @click="selectSchool(suggestion)"
              >
                <div class="suggestion-name">{{ suggestion.name }}</div>
                <div class="suggestion-city" v-if="suggestion.city">{{ suggestion.city }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="grade" class="form-label">
              Класс *
              <span class="error-message" v-if="errors.grade">{{ errors.grade }}</span>
            </label>
            <select
              id="grade"
              v-model="formData.grade"
              :class="['form-select', { 'error': errors.grade }]"
              @blur="validateField('grade')"
            >
              <option value="">Выберите класс</option>
              <option v-for="grade in grades" :key="grade" :value="grade">
                {{ grade }} класс
              </option>
            </select>
          </div>

          <div class="form-group half">
            <label for="region" class="form-label">Регион</label>
            <select
              id="region"
              v-model="formData.region"
              class="form-select"
              @change="loadSchoolsByRegion"
            >
              <option value="">Выберите регион</option>
              <option v-for="region in regions" :key="region.id" :value="region.name">
                {{ region.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="consent-checkbox">
          <input
            type="checkbox"
            id="consent"
            v-model="formData.consent"
            :class="{ 'error': errors.consent }"
          >
          <label for="consent" class="consent-label">
            Я даю согласие на обработку моих персональных данных в соответствии с 
            <a href="#" class="consent-link">Политикой конфиденциальности</a>
          </label>
          <span class="error-message" v-if="errors.consent">{{ errors.consent }}</span>
        </div>

        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="isSubmitting">
            <span class="spinner"></span> Регистрация...
          </span>
          <span v-else>Зарегистрироваться в системе</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, onMounted, watch } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const formData = reactive({
  email: '',
  lastName: '',
  firstName: '',
  middleName: '',
  phone: '',
  school: '',
  grade: '',
  region: '',
  consent: false
})

const errors = reactive({
  email: '',
  lastName: '',
  firstName: '',
  school: '',
  grade: '',
  consent: ''
})

const isSubmitting = ref(false)
const schoolSuggestions = ref([])
const regions = ref([])
const registrationStats = ref(null)

const grades = Array.from({length: 11}, (_, i) => i + 1) // 1-11 классы

watch(() => props.isVisible, async (isVisible) => {
  if (isVisible) {
    await loadRegions()
    await loadRegistrationStats()
    resetForm()
  }
})

const closeModal = () => {
  emit('close')
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    if (key !== 'consent') formData[key] = ''
  })
  formData.consent = false
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  schoolSuggestions.value = []
}

const loadRegions = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/regions')
    if (response.ok) {
      regions.value = await response.json()
    }
  } catch (error) {
    console.error('Ошибка загрузки регионов:', error)
  }
}

const loadRegistrationStats = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/stats/registrations')
    if (response.ok) {
      registrationStats.value = await response.json()
    }
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  }
}

const searchSchools = async (event) => {
  const searchTerm = event.target.value
  if (searchTerm.length < 2) {
    schoolSuggestions.value = []
    return
  }

  try {
    const response = await fetch(`http://localhost:3001/api/schools?search=${encodeURIComponent(searchTerm)}`)
    if (response.ok) {
      schoolSuggestions.value = await response.json()
    }
  } catch (error) {
    console.error('Ошибка поиска школ:', error)
  }
}

const selectSchool = (school) => {
  formData.school = school.name
  schoolSuggestions.value = []
}

const loadSchoolsByRegion = async () => {
  if (!formData.region) return
  
  try {
    const response = await fetch(`http://localhost:3001/api/schools?search=${encodeURIComponent(formData.region)}`)
    if (response.ok) {
      const schools = await response.json()
      console.log('Школы в регионе:', schools)
    }
  } catch (error) {
    console.error('Ошибка загрузки школ по региону:', error)
  }
}

const validateField = (fieldName) => {
  const value = formData[fieldName]
  
  switch (fieldName) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      errors.email = emailRegex.test(value) ? '' : 'Введите корректный email'
      break
    case 'lastName':
      errors.lastName = value.trim() ? '' : 'Введите фамилию'
      break
    case 'firstName':
      errors.firstName = value.trim() ? '' : 'Введите имя'
      break
    case 'school':
      errors.school = value.trim() ? '' : 'Введите школу'
      break
    case 'grade':
      errors.grade = value ? '' : 'Выберите класс'
      break
    case 'consent':
      errors.consent = value ? '' : 'Необходимо согласие на обработку данных'
      break
  }
}

const validateForm = () => {
  validateField('email')
  validateField('lastName')
  validateField('firstName')
  validateField('school')
  validateField('grade')
  validateField('consent')
  
  return !Object.values(errors).some(error => error)
}

const handleSubmit = async () => {
  if (!validateForm()) {
    const firstErrorField = Object.keys(errors).find(key => errors[key])
    if (firstErrorField) {
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }
    return
  }

  isSubmitting.value = true

  try {
    const response = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        lastName: formData.lastName,
        firstName: formData.firstName,
        middleName: formData.middleName,
        school: formData.school,
        grade: formData.grade,
        phone: formData.phone,
        region: formData.region,
        consent: formData.consent
      })
    })

    const data = await response.json()

    if (response.ok) {
      emit('success', { 
        ...formData,
        userId: data.user.id,
        tempPassword: data.tempPassword 
      })
      
      closeModal()
      
      setTimeout(() => {
        alert(`✅ Регистрация успешна!\n\nДобро пожаловать в систему НИРС УГНТУ!\nВаш логин: ${data.user.email}\nВременный пароль: ${data.tempPassword}\n\nПожалуйста, сохраните эти данные!`)
      }, 300)
      
    } else {
      throw new Error(data.error || 'Ошибка регистрации')
    }
    
  } catch (error) {
    console.error('Ошибка регистрации:', error)
    alert(`❌ Ошибка регистрации: ${error.message}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.registration-modal-overlay {
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
  animation: fadeIn 0.3s ease;
  padding: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.registration-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  position: relative;
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
}

.modal-title-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.modal-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.close-btn svg {
  display: block;
}

.registration-form {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-group.half {
  flex: 1;
}

.form-group.third {
  flex: 1;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message {
  color: #d32f2f;
  font-size: 0.8rem;
  font-weight: 500;
}

.form-input, .form-select {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #622A97;
  box-shadow: 0 0 0 3px rgba(98, 42, 151, 0.1);
}

.form-input.error, .form-select.error {
  border-color: #d32f2f;
  background: #fff5f5;
}

.form-input::placeholder {
  color: #999;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23622A97' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  padding-right: 40px;
}

/* Стили для автозаполнения */
.autocomplete-wrapper {
  position: relative;
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0 0 10px 10px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.suggestion-item:hover {
  background: #f5f5f5;
}

.suggestion-name {
  font-weight: 500;
  color: #333;
}

.suggestion-city {
  font-size: 0.85rem;
  color: #666;
  margin-top: 2px;
}

/* Стили для чекбокса согласия */
.consent-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 10px 0;
  padding: 15px;
  background: #f9f7ff;
  border-radius: 10px;
  border: 1px solid rgba(98, 42, 151, 0.1);
}

.consent-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: #622A97;
}

.consent-checkbox input[type="checkbox"].error {
  outline: 2px solid #d32f2f;
  outline-offset: 2px;
}

.consent-label {
  flex: 1;
  font-size: 0.9rem;
  color: #555;
  line-height: 1.4;
  cursor: pointer;
}

.consent-link {
  color: #622A97;
  text-decoration: underline;
  transition: color 0.3s;
}

.consent-link:hover {
  color: #4a1f72;
}

/* Кнопка отправки */
.submit-btn {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(98, 42, 151, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Стили для статистики */
.stats-section {
  margin-top: 20px;
  padding: 20px 30px;
  border-top: 1px solid #eee;
}

.stats-grid {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #622A97;
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  margin-top: 5px;
}

/* Адаптивность */
@media (max-width: 600px) {
  .registration-modal {
    max-width: 95%;
  }
  
  .modal-header {
    padding: 20px;
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .registration-form {
    padding: 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .form-group.half,
  .form-group.third {
    flex: none;
  }
  
  .stats-grid {
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 400px) {
  .modal-title {
    font-size: 1.3rem;
  }
  
  .consent-checkbox {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>