<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="container">
        <div class="header-content">
          <div class="logo-container">
        <img src="@/assets/logo_icon.png" alt="Logo" class="logo-icon" />
        <span class="logo">Личный кабинет</span>
      </div>
          
          <div class="user-info">
            <div class="user-details">
              <p class="user-name">{{ user.full_name || 'Абитуриент' }}</p>
              <p class="user-email">{{ user.email || 'user@example.com' }}</p>
            </div>
            <button class="logout-btn" @click="handleLogout">
              <span class="logout-icon">🚪</span>
              <span class="logout-text">Выйти</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="dashboard-main">
      <div class="container">
        <div class="dashboard-layout">
          <aside class="sidebar">
            <nav class="sidebar-nav">
              <router-link 
                to="/dashboard" 
                class="nav-item" 
                :class="{ 'active': $route.path === '/dashboard' }"
                exact
              >
                <span class="nav-icon">🏠</span>
                <span class="nav-text">Главная</span>
              </router-link>
              
              <router-link 
                to="/dashboard/profile" 
                class="nav-item"
                :class="{ 'active': $route.path === '/dashboard/profile' }"
              >
                <span class="nav-icon">👤</span>
                <span class="nav-text">Личная информация</span>
              </router-link>
              
              <router-link 
                to="/dashboard/events" 
                class="nav-item"
                :class="{ 'active': $route.path === '/dashboard/events' }"
              >
                <span class="nav-icon">📅</span>
                <span class="nav-text">Мероприятия</span>
                <span class="nav-badge">{{ totalEvents }}</span>
              </router-link>
              
              <router-link 
                to="/dashboard/my-events" 
                class="nav-item"
                :class="{ 'active': $route.path === '/dashboard/my-events' }"
              >
                <span class="nav-icon">✅</span>
                <span class="nav-text">Посещенные</span>
                <span class="nav-badge">{{ attendedEvents }}</span>
              </router-link>
              
              <router-link 
                to="/dashboard/qr" 
                class="nav-item"
                :class="{ 'active': $route.path === '/dashboard/qr' }"
              >
                <span class="nav-icon">📱</span>
                <span class="nav-text">Мой QR код</span>
              </router-link>

              <router-link 
  to="/dashboard/feedback" 
  class="nav-item"
  :class="{ 'active': $route.path === '/dashboard/feedback' }"
>
  <span class="nav-icon">💬</span>
  <span class="nav-text">Обратная связь</span>
</router-link>
              
              <router-link 
                to="/dashboard/points" 
                class="nav-item"
                :class="{ 'active': $route.path === '/dashboard/points' }"
              >
                <span class="nav-icon">⭐</span>
                <span class="nav-text">Баллы</span>
                <span class="nav-badge">{{ totalPoints }}</span>
              </router-link>
            </nav>
            
            <div class="events-counter">
              <div class="counter-icon">🎯</div>
              <div class="counter-content">
                <div class="counter-number">{{ attendedEvents }}</div>
                <div class="counter-label">мероприятий</div>
              </div>
            </div>
          </aside>

          <main class="main-content">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref(JSON.parse(localStorage.getItem('user')) || {})
const totalEvents = ref(0)
const attendedEvents = ref(0)
const totalPoints = ref(0)

const userInitials = computed(() => {
  const names = user.value.full_name?.split(' ') || []
  const initials = names.map(name => name[0]).join('').toUpperCase()
  return initials || 'U'
})

const loadUserStats = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3001/api/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      totalEvents.value = data.stats?.totalEvents || 0
      attendedEvents.value = data.stats?.attendedEvents || 0
      totalPoints.value = data.stats?.totalPoints || 0
    }
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  }
}

const goToProfile = () => {
  router.push('/dashboard/profile')
}

const handleLogout = () => {
  if (confirm('Вы уверены, что хотите выйти?')) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
    alert('Вы успешно вышли из системы.')
  }
}

onMounted(() => {
  loadUserStats()
  
  const intervalId = setInterval(loadUserStats, 30000)
  
  return () => clearInterval(intervalId)
})
</script>

<style scoped>
.dashboard {
  padding: 0 20px;
  min-height: 100vh;
  background: #f5f7fa;
  max-width: 100vw;
  overflow-x: hidden;
}

.dashboard-header {
  border-radius: 15px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
}

.header-content {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: #622A97;
  margin: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  z-index: 1001;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}


.user-details {
  text-align: right;
}

.user-name {
  font-weight: 600;
  margin: 0;
  color: #333;
}

.user-email {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.logout-btn {
  background: #f0f0f0;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #e0e0e0;
}

.dashboard-main {
  padding: 30px 0;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
}

.sidebar {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: fit-content;
  position: sticky;
  top: 30px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  border-radius: 10px;
  text-decoration: none;
  color: #666;
  transition: all 0.3s;
  position: relative;
}

.nav-item:hover {
  background: #f5f5f5;
  color: #622A97;
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(98, 42, 151, 0.1), rgba(203, 121, 218, 0.1));
  color: #622A97;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.2rem;
}

.nav-text {
  flex: 1;
}

.nav-badge {
  background: #622A97;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
}

.events-counter {
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #622A97, #CB79DA);
  border-radius: 15px;
  color: white;
  display: flex;
  align-items: center;
  gap: 15px;
}

.counter-icon {
  font-size: 2rem;
}

.counter-content {
  display: flex;
  flex-direction: column;
}

.counter-number {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.counter-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.main-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: static;
  }
  
  .header-content {
    flex-direction: column;
    gap: 15px;
  }
}
</style>