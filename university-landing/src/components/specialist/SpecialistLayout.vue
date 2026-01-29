<template>
  <div class="specialist-dashboard">
    <!-- Боковая панель навигации -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="user-info">
          <div class="avatar">{{ userInitials }}</div>
          <div class="user-details">
            <h3>{{ user.full_name }}</h3>
            <p class="user-role">Специалист</p>
            <p class="user-email">{{ user.email }}</p>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li>
            <router-link to="/specialist/dashboard" class="nav-link" active-class="active">
              <span class="nav-icon">📊</span>
              <span>Главная</span>
            </router-link>
          </li>
          <li>
            <router-link to="/specialist/events" class="nav-link" active-class="active">
              <span class="nav-icon">📅</span>
              <span>Календарь мероприятий</span>
            </router-link>
          </li>
          <li>
            <router-link to="/specialist/feedback" class="nav-link" active-class="active">
              <span class="nav-icon">💬</span>
              <span>Обратная связь</span>
              <span class="badge" v-if="unreadFeedback > 0">{{ unreadFeedback }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/specialist/analytics" class="nav-link" active-class="active">
              <span class="nav-icon">📈</span>
              <span>Аналитика</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <button @click="logout" class="logout-btn">
          <span class="nav-icon">🚪</span>
          <span>Выйти</span>
        </button>
      </div>
    </aside>

    <!-- Основной контент -->
    <main class="main-content">
      <header class="main-header">
        <div class="header-left">
          <h1 class="page-title">{{ currentPageTitle }}</h1>
          <p class="page-subtitle">{{ currentPageSubtitle }}</p>
        </div>
      </header>

      <div class="content-wrapper">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Данные пользователя
const user = ref({
  full_name: 'Специалист УГНТУ',
  email: localStorage.getItem('user_email') || 'specialist@ugntu.ru',
  role: 'specialist'
})

// Состояния
const unreadFeedback = ref(0)
const notificationCount = ref(0)

// Вычисляемые свойства
const userInitials = computed(() => {
  return user.value.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
})

const pageTitles = {
  '/specialist/dashboard': { title: 'Главная', subtitle: 'Обзор деятельности' },
  '/specialist/events': { title: 'Мероприятия', subtitle: 'Управление событиями' },
  '/specialist/feedback': { title: 'Обратная связь', subtitle: 'Отзывы и вопросы' },
  '/specialist/analytics': { title: 'Аналитика', subtitle: 'Статистика по мероприятиям' }
}

const currentPageTitle = computed(() => {
  return pageTitles[route.path]?.title || 'Кабинет специалиста'
})

const currentPageSubtitle = computed(() => {
  return pageTitles[route.path]?.subtitle || ''
})

// Методы
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('user_email')
  router.push('/')
}

const refreshData = () => {
  console.log('Обновление данных...')
  // Здесь будет логика обновления данных
}

// Жизненный цикл
onMounted(() => {
  // Загружаем данные пользователя
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
    } catch (e) {
      console.error('Ошибка загрузки данных пользователя:', e)
    }
  }
  
  // Проверяем, специалист ли это
  if (user.value.email !== 'elisonkein@yahoo.com') {
    alert('Доступ запрещен. Только для специалистов.')
    router.push('/')
  }
})
</script>

<style scoped>
.specialist-dashboard {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  padding: 30px 20px;
  border-bottom: 1px solid #eaeaea;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #622A97, #CB79DA);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(98, 42, 151, 0.3);
}

.user-details h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #333;
}

.user-role {
  color: #622A97;
  font-weight: 600;
  font-size: 14px;
  margin: 0 0 5px 0;
}

.user-email {
  color: #666;
  font-size: 12px;
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin: 5px 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  color: #555;
  text-decoration: none;
  transition: all 0.3s;
  position: relative;
  border-left: 4px solid transparent;
}

.nav-link:hover {
  background: #f9f7ff;
  color: #622A97;
  border-left-color: #CB79DA;
}

.nav-link.active {
  background: linear-gradient(90deg, rgba(98, 42, 151, 0.1), transparent);
  color: #622A97;
  border-left-color: #622A97;
  font-weight: 600;
}

.nav-icon {
  font-size: 20px;
  margin-right: 15px;
  width: 24px;
  text-align: center;
}

.badge {
  background: #ff4757;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: auto;
}

/* Футер сайдбара */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #eaeaea;
}

.logout-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 20px;
  background: #fff5f5;
  border: 1px solid #ffd1d1;
  border-radius: 10px;
  color: #ff4757;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #ff4757;
  color: white;
}

/* Основной контент */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-header {
  background: white;
  padding: 25px 30px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left .page-title {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #333;
  font-weight: 700;
}

.page-subtitle {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.action-btn {
  background: #f5f7fa;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #622A97;
  color: white;
  transform: rotate(90deg);
}

.notification-btn {
  position: relative;
  background: #f5f7fa;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s;
}

.notification-btn:hover {
  background: #622A97;
  color: white;
}

.notification-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  font-size: 12px;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
}

.content-wrapper {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }
}

@media (max-width: 768px) {
  .specialist-dashboard {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eaeaea;
  }
  
  .sidebar-nav ul {
    display: flex;
    overflow-x: auto;
  }
  
  .sidebar-nav li {
    flex-shrink: 0;
  }
  
  .nav-link {
    padding: 15px;
    border-left: none;
    border-bottom: 3px solid transparent;
  }
  
  .nav-link.active {
    border-left: none;
    border-bottom-color: #622A97;
  }
}
</style>