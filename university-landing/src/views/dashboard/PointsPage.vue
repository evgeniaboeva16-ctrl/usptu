<template>
  <div class="points-page">
    <div class="page-header">
      <h2>Мои баллы</h2>
      <p>Система поощрений и достижений</p>
    </div>

    <!-- Основная статистика -->
    <div class="points-overview">
      <div class="total-points-card">
        <div class="total-points-icon">⭐</div>
        <div class="total-points-content">
          <div class="total-points-number">{{ totalPoints }}</div>
          <div class="total-points-label">Всего баллов</div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ ranking.position || '—' }}</div>
          <div class="stat-label">Место в рейтинге</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-value">{{ ranking.totalUsers || 0 }}</div>
          <div class="stat-label">Всего участников</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-value">{{ ranking.percentile || 0 }}%</div>
          <div class="stat-label">Лучше чем</div>
        </div>
      </div>
    </div>

    <!-- Уровни/достижения -->
    <div class="achievements-section">
      <h3 class="section-title">Достижения</h3>
      
      <div class="achievements-grid">
        <div 
          v-for="achievement in achievements" 
          :key="achievement.id"
          :class="['achievement-card', { 'unlocked': achievement.unlocked }]"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-content">
            <h4 class="achievement-title">{{ achievement.title }}</h4>
            <p class="achievement-description">{{ achievement.description }}</p>
            <div class="achievement-progress" v-if="!achievement.unlocked">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: achievement.progress + '%' }"
                ></div>
              </div>
              <div class="progress-text">{{ achievement.progress }}%</div>
            </div>
            <div v-else class="achievement-unlocked">
              <span class="unlocked-badge">Разблокировано!</span>
              <span class="points-reward">+{{ achievement.points }} баллов</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- История начислений -->
    <div class="history-section">
      <h3 class="section-title">История начислений</h3>
      
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Загружаем историю...</p>
      </div>

      <div v-else-if="history.length === 0" class="empty-history">
        <p>История начислений пока пуста</p>
      </div>

      <div v-else class="history-list">
        <div v-for="item in history" :key="item.id" class="history-item">
          <div class="history-icon">
            <span v-if="item.action === 'event_attendance'">🎫</span>
            <span v-else-if="item.action === 'registration'">📝</span>
            <span v-else>⭐</span>
          </div>
          
          <div class="history-content">
            <div class="history-header">
              <h4 class="history-title">{{ getActionTitle(item.action) }}</h4>
              <span class="history-points">+{{ item.points }}</span>
            </div>
            
            <div class="history-details">
              <p v-if="item.event_title" class="event-name">{{ item.event_title }}</p>
              <p class="history-date">{{ formatDate(item.created_at) }}</p>
              <p v-if="item.created_by_name" class="history-author">
                Начислил: {{ item.created_by_name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Правила системы -->
    <div class="rules-section">
      <h3 class="section-title">Как заработать баллы?</h3>
      
      <div class="rules-grid">
        <div class="rule-card">
          <div class="rule-icon">🎓</div>
          <h4 class="rule-title">Посещение мероприятий</h4>
          <p class="rule-description">За каждое посещенное мероприятие вы получаете баллы</p>
          <div class="rule-points">+10 баллов</div>
        </div>
        
        <div class="rule-card">
          <div class="rule-icon">📝</div>
          <h4 class="rule-title">Регистрация</h4>
          <p class="rule-description">За регистрацию на сайте вы получаете стартовые баллы</p>
          <div class="rule-points">+50 баллов</div>
        </div>
        
        <div class="rule-card">
          <div class="rule-icon">👥</div>
          <h4 class="rule-title">Приглашение друзей</h4>
          <p class="rule-description">Пригласите друзей в УГНТУ и получите бонусы</p>
          <div class="rule-points">+25 баллов за друга</div>
        </div>
        
        <div class="rule-card">
          <div class="rule-icon">📊</div>
          <h4 class="rule-title">Активность</h4>
          <p class="rule-description">За регулярную активность на сайте</p>
          <div class="rule-points">+5 баллов в неделю</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Состояния
const totalPoints = ref(0)
const ranking = ref({})
const history = ref([])
const achievements = ref([])
const loading = ref(false)

// Методы
const loadPointsData = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    
    // Загружаем данные о баллах
    const pointsResponse = await fetch('http://localhost:3001/api/dashboard/points', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (pointsResponse.ok) {
      const pointsData = await pointsResponse.json()
      totalPoints.value = pointsData.points?.total || 0
      ranking.value = pointsData.points?.ranking || {}
      history.value = pointsData.points?.history || []
    }
    
    // Загружаем достижения
    await loadAchievements()
    
  } catch (error) {
    console.error('Ошибка загрузки данных о баллах:', error)
  } finally {
    loading.value = false
  }
}

const loadAchievements = async () => {
  // Заглушка для достижений
  achievements.value = [
    {
      id: 1,
      icon: '🥇',
      title: 'Первый шаг',
      description: 'Посетите первое мероприятие',
      unlocked: totalPoints.value >= 10,
      progress: Math.min((totalPoints.value / 10) * 100, 100),
      points: 10
    },
    {
      id: 2,
      icon: '🎓',
      title: 'Активный абитуриент',
      description: 'Посетите 5 мероприятий',
      unlocked: totalPoints.value >= 50,
      progress: Math.min((totalPoints.value / 50) * 100, 100),
      points: 50
    },
    {
      id: 3,
      icon: '🏆',
      title: 'Лидер рейтинга',
      description: 'Займите место в топ-10',
      unlocked: ranking.value.position <= 10,
      progress: ranking.value.position ? Math.max(0, 100 - (ranking.value.position / ranking.value.totalUsers) * 100) : 0,
      points: 100
    }
  ]
}

const getActionTitle = (action) => {
  const titles = {
    'event_attendance': 'Посещение мероприятия',
    'registration': 'Регистрация на сайте',
    'referral': 'Приглашение друга',
    'activity': 'Активность на сайте'
  }
  return titles[action] || 'Начисление баллов'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Жизненный цикл
onMounted(() => {
  loadPointsData()
})
</script>

<style scoped>
.points-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 40px;
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

/* Обзор баллов */
.points-overview {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 40px;
}

.total-points-card {
  flex: 1;
  min-width: 300px;
  background: linear-gradient(135deg, #622A97, #CB79DA);
  border-radius: 20px;
  padding: 30px;
  color: white;
  display: flex;
  align-items: center;
  gap: 25px;
  box-shadow: 0 10px 30px rgba(98, 42, 151, 0.3);
}

.total-points-icon {
  font-size: 4rem;
}

.total-points-content {
  flex: 1;
}

.total-points-number {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 5px;
}

.total-points-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

.stats-grid {
  flex: 1;
  min-width: 300px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  background: white;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #622A97;
  margin-bottom: 10px;
}

.stat-label {
  color: #666;
  font-size: 0.95rem;
}

/* Достижения */
.achievements-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.achievement-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  display: flex;
  gap: 20px;
  transition: all 0.3s;
}

.achievement-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.achievement-card.unlocked {
  border-color: #4CAF50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(76, 175, 80, 0.02));
}

.achievement-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.achievement-description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 15px;
  line-height: 1.5;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  border-radius: 5px;
  transition: width 0.3s;
}

.progress-text {
  color: #666;
  font-weight: 600;
  min-width: 50px;
  text-align: right;
}

.achievement-unlocked {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.unlocked-badge {
  background: #4CAF50;
  color: white;
  padding: 6px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.points-reward {
  color: #FF9800;
  font-weight: 600;
  font-size: 1.1rem;
}

/* История начислений */
.history-section {
  margin-bottom: 40px;
}

.loading-state,
.empty-history {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.history-item:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.history-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.history-content {
  flex: 1;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.history-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.history-points {
  color: #4CAF50;
  font-weight: 700;
  font-size: 1.2rem;
}

.history-details {
  color: #666;
  font-size: 0.9rem;
}

.event-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.history-date {
  margin-bottom: 5px;
  opacity: 0.8;
}

.history-author {
  opacity: 0.7;
  font-style: italic;
}

/* Правила системы */
.rules-section {
  margin-bottom: 40px;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.rule-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  text-align: center;
  transition: all 0.3s;
}

.rule-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.rule-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.rule-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.rule-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.5;
}

.rule-points {
  color: #FF9800;
  font-weight: 700;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .points-overview {
    flex-direction: column;
  }
  
  .total-points-card {
    min-width: 100%;
  }
  
  .stats-grid {
    min-width: 100%;
    grid-template-columns: 1fr;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .rules-grid {
    grid-template-columns: 1fr;
  }
  
  .history-item {
    flex-direction: column;
    gap: 15px;
  }
  
  .history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>