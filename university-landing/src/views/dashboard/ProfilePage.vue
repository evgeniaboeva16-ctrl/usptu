<template>
  <div class="profile-page">
    <div class="page-header">
      <h2>Личная информация</h2>
      <p>Управление вашими персональными данными</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Загружаем данные профиля...</p>
    </div>

    <form v-else @submit.prevent="saveProfile" class="profile-form">
      <div class="form-section">
        <h3 class="section-title">Основная информация</h3>
        
        <div class="form-grid">
          <div class="form-group">
            <label>ФИО</label>
            <input v-model="profileData.full_name" type="text" placeholder="Фамилия Имя Отчество">
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input v-model="profileData.email" type="email" placeholder="Ваш email" disabled>
            <small class="field-note">Email нельзя изменить</small>
          </div>
          
          <div class="form-group">
            <label>Телефон</label>
            <input v-model="profileData.phone" type="tel" placeholder="+7 (999) 123-45-67">
          </div>
          
          <div class="form-group">
            <label>Дата рождения</label>
            <input v-model="profileData.birth_date" type="date">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Образовательная информация</h3>
        
        <div class="form-grid">
          <div class="form-group">
            <label>Школа</label>
            <input v-model="profileData.school_name" type="text" placeholder="Название школы">
          </div>
          
          <div class="form-group">
            <label>Класс</label>
            <select v-model="profileData.grade">
              <option value="">Выберите класс</option>
              <option v-for="g in 11" :key="g" :value="g">{{ g }} класс</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Регион</label>
            <input v-model="profileData.region_name" type="text" placeholder="Ваш регион">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Дополнительная информация</h3>
        
        <div class="form-group">
          <label>Интересы</label>
          <textarea 
            v-model="profileData.interests" 
            rows="3" 
            placeholder="Расскажите о своих увлечениях..."
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Интересующие факультеты</label>
          <textarea 
            v-model="profileData.preferred_faculties" 
            rows="3" 
            placeholder="Какие направления вас интересуют?"
          ></textarea>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Информация о родителях</h3>
        
        <div class="form-grid">
          <div class="form-group">
            <label>ФИО родителя</label>
            <input v-model="profileData.parent_name" type="text" placeholder="ФИО родителя">
          </div>
          
          <div class="form-group">
            <label>Телефон родителя</label>
            <input v-model="profileData.parent_phone" type="tel" placeholder="+7 (999) 123-45-67">
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="cancelEdit">Отмена</button>
        <button type="submit" class="btn-primary" :disabled="isSaving">
          <span v-if="isSaving" class="spinner"></span>
          <span v-else>Сохранить изменения</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const profileData = ref({
  full_name: '',
  email: '',
  phone: '',
  birth_date: '',
  school_name: '',
  grade: '',
  region_name: '',
  interests: '',
  preferred_faculties: '',
  parent_name: '',
  parent_phone: ''
})

const originalData = ref({})
const loading = ref(true)
const isSaving = ref(false)

onMounted(async () => {
  await loadProfile()
})

const loadProfile = async () => {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      console.error('Токен не найден')
      loading.value = false
      return
    }

    console.log('Загружаем профиль...')
    
    const response = await fetch('http://localhost:3001/api/dashboard/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Ответ сервера:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('Данные профиля:', data)
      
      // Заполняем форму данными
      if (data.profile) {
        profileData.value = {
          full_name: data.profile.full_name || '',
          email: data.profile.email || '',
          phone: data.profile.phone || '',
          birth_date: data.profile.birth_date ? formatDateForInput(data.profile.birth_date) : '',
          school_name: data.profile.school_name || '',
          grade: data.profile.grade || '',
          region_name: data.profile.region_name || '',
          interests: data.profile.interests || '',
          preferred_faculties: data.profile.preferred_faculties || '',
          parent_name: data.profile.parent_name || '',
          parent_phone: data.profile.parent_phone || ''
        }
        
        originalData.value = { ...profileData.value }
      }
    } else {
      console.error('Ошибка загрузки профиля:', response.status)
      const errorData = await response.json()
      console.error('Детали ошибки:', errorData)
      alert('Ошибка загрузки профиля')
    }
  } catch (error) {
    console.error('Ошибка сети при загрузке профиля:', error)
    alert('Ошибка подключения к серверу')
  } finally {
    loading.value = false
  }
}

// Форматируем дату для input[type="date"]
const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3001/api/dashboard/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        full_name: profileData.value.full_name, 
        phone: profileData.value.phone,
        birth_date: profileData.value.birth_date,
        grade: profileData.value.grade,
        interests: profileData.value.interests,
        parent_name: profileData.value.parent_name,
        parent_phone: profileData.value.parent_phone,
        preferred_faculties: profileData.value.preferred_faculties
        // Примечание: full_name, email, school_name, region_name 
        // обычно обновляются через другие эндпоинты
      })
    })
    
    if (response.ok) {
      alert('Профиль успешно обновлен!')
      originalData.value = { ...profileData.value }
    } else {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Ошибка сохранения профиля')
    }
  } catch (error) {
    alert(`Ошибка: ${error.message}`)
  } finally {
    isSaving.value = false
  }
}

const cancelEdit = () => {
  profileData.value = { ...originalData.value }
}
</script>

<style scoped>

.loading-state {
  text-align: center;
  padding: 60px 20px;
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

.field-note {
  color: #666;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}

.form-group input:disabled {
  background-color: #f9f9f9;
  color: #666;
  cursor: not-allowed;
}

.profile-page {
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

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
  width: 100%;
  box-sizing: border-box;
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
  min-height: 100px;
  font-family: inherit;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.btn-primary,
.btn-secondary {
  padding: 12px 30px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(98, 42, 151, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 15px;
  }
  
  .page-header h2 {
    font-size: 1.8rem;
  }
  
  .form-section {
    padding: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    padding: 15px;
  }
}



/* Стили для страницы профиля */
.profile-page {
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

/* Форма профиля */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

/* Сетка форм */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #622A97;
  box-shadow: 0 0 0 3px rgba(98, 42, 151, 0.1);
}

.form-group input:disabled,
.form-group input[readonly] {
  background-color: #f9f9f9;
  cursor: not-allowed;
  opacity: 0.7;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

/* Кнопки действий */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.btn-primary,
.btn-secondary {
  padding: 12px 30px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(98, 42, 151, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* Индикатор загрузки */
.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Адаптивность */
@media (max-width: 768px) {
  .profile-page {
    padding: 15px;
  }
  
  .page-header h2 {
    font-size: 1.8rem;
  }
  
  .form-section {
    padding: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .page-header h2 {
    font-size: 1.6rem;
  }
  
  .page-header p {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 10px 12px;
    font-size: 0.95rem;
  }
}
</style>