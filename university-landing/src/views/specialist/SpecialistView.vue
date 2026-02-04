<template>
  <div class="specialist-view">
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Загрузка панели управления...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>{{ error }}</h3>
      <button @click="goToHome" class="back-btn">Вернуться на главную</button>
    </div>
    
    <SpecialistLayout v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SpecialistLayout from '@/components/specialist/SpecialistLayout.vue'

const router = useRouter()
const isLoading = ref(true)
const error = ref(null)

const checkAccess = async () => {
  try {
    const userEmail = localStorage.getItem('user_email')
    const token = localStorage.getItem('token')
    
    if (!token) {
      throw new Error('Требуется авторизация')
    }
    
    if (userEmail !== 'elisonkein@yahoo.com') {
      throw new Error('Доступ разрешен только для специалистов УГНТУ')
    }

    
    return true
  } catch (err) {
    error.value = err.message
    return false
  }
}

const goToHome = () => {
  router.push('/')
}

onMounted(async () => {
  const hasAccess = await checkAccess()
  
  if (!hasAccess && !error.value) {
    error.value = 'Неизвестная ошибка доступа'
  }
  
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<style scoped>
.specialist-view {
  min-height: 100vh;
  background: #f5f7fa;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(98, 42, 151, 0.1);
  border-left-color: #622A97;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container p {
  color: #666;
  font-size: 16px;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
}

.error-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.error-container h3 {
  color: #d32f2f;
  margin: 0 0 20px 0;
  font-size: 20px;
}

.back-btn {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(98, 42, 151, 0.4);
}
</style>