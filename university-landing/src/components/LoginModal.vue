<template>
  <div class="login-modal-overlay" @click.self="closeModal">
    <div class="login-modal">
      <div class="modal-header">
        <div class="modal-title-container">
          <h2 class="modal-title">Вход в личный кабинет</h2>
        </div>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            v-model="loginData.email"
            class="form-input"
            placeholder="Введите ваш email"
            required
          >
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <input
            type="password"
            id="password"
            v-model="loginData.password"
            class="form-input"
            placeholder="Введите ваш пароль"
            required
          >
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Войти</span>
        </button>

        <div class="form-footer">
          <p>Нет аккаунта? <a href="#" @click.prevent="switchToRegister">Зарегистрироваться</a></p>
          <p><a href="#" @click.prevent="showForgotPassword">Забыли пароль?</a></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['close', 'login-success', 'show-register'])

const loginData = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)

const closeModal = () => {
  emit('close')
}

const handleLogin = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData.value)
    })

    const data = await response.json()
    
    if (response.ok) {
      // Сохраняем данные пользователя
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('user_email', data.user.email)
      
      emit('login-success', data.user)
      closeModal()
      
      // Проверяем email для определения типа пользователя
      if (data.user.email === 'elisonkein@yahoo.com') {
        // Редирект в ЛК специалиста
        window.location.href = '/specialist'
      } else {
        // Редирект в ЛК абитуриента
        window.location.href = '/dashboard'
      }
    } else {
      throw new Error(data.error || 'Ошибка входа')
    }
  } catch (error) {
    alert(`Ошибка входа: ${error.message}`)
  } finally {
    isLoading.value = false
  }
}

const switchToRegister = () => {
  closeModal()
  emit('show-register')
}

const showForgotPassword = () => {
  alert('Функция восстановления пароля в разработке')
}
</script>

<style scoped>
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.login-modal {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.modal-title-container {
  flex: 1;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #666;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
  margin-left: 20px;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #555;
  font-size: 16px;
}

.form-input {
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #622A97;
  box-shadow: 0 0 0 3px rgba(98, 42, 151, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.submit-btn {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(98, 42, 151, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.form-footer p {
  margin: 10px 0;
  color: #666;
  font-size: 14px;
}

.form-footer a {
  color: #622A97;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.form-footer a:hover {
  text-decoration: underline;
}

/* Спиннер для загрузки */
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

/* Анимации */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Адаптивность */
@media (max-width: 600px) {
  .login-modal {
    padding: 30px 25px;
    width: 95%;
  }
  
  .modal-title {
    font-size: 24px;
  }
  
  .close-btn {
    font-size: 28px;
    width: 36px;
    height: 36px;
  }
  
  .form-input {
    padding: 12px;
    font-size: 15px;
  }
  
  .submit-btn {
    padding: 14px;
    font-size: 16px;
  }
}

@media (max-width: 400px) {
  .login-modal {
    padding: 25px 20px;
  }
  
  .modal-title {
    font-size: 22px;
  }
  
  .modal-header {
    margin-bottom: 25px;
  }
}
</style>