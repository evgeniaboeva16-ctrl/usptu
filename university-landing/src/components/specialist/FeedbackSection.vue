<template>
  <div class="feedback-section">
    <div class="section-header">
      <h1>Обратная связь</h1>
      <p class="section-subtitle">Отзывы и вопросы от участников мероприятий</p>
    </div>

    <!-- Заглушка -->
    <div class="placeholder-content">
      <div class="placeholder-icon">🚧</div>
      <h2>Раздел в разработке</h2>
      <p>В этом разделе будет доступен просмотр отзывов и вопросов от участников мероприятий, а также возможность отвечать на них.</p>
      
      <div class="placeholder-features">
        <div class="feature-item">
          <div class="feature-icon">💬</div>
          <h3>Чат с участниками</h3>
          <p>Общайтесь с зарегистрированными участниками</p>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">⭐</div>
          <h3>Оценки мероприятий</h3>
          <p>Просматривайте рейтинги и отзывы</p>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">📊</div>
          <h3>Аналитика отзывов</h3>
          <p>Статистика по обратной связи</p>
        </div>
      </div>
      
      <div class="placeholder-actions">
        <button @click="goToEvents" class="action-btn primary">
          📅 Перейти к мероприятиям
        </button>
        <button @click="checkAnalytics" class="action-btn">
          📈 Посмотреть аналитику
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToEvents = () => {
  router.push('/specialist/events')
}

const checkAnalytics = () => {
  router.push('/specialist/analytics')
}
</script>

<style scoped>
.feedback-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-header h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
  color: #333;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  margin: 0;
  color: #666;
  font-size: 16px;
}

/* Заглушка */
.placeholder-content {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.08);
  border: 2px dashed #eaeaea;
}

.placeholder-icon {
  font-size: 80px;
  margin-bottom: 30px;
  opacity: 0.8;
}

.placeholder-content h2 {
  margin: 0 0 15px 0;
  font-size: 28px;
  color: #333;
}

.placeholder-content > p {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 40px auto;
}

/* Особенности раздела */
.placeholder-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin: 40px 0;
}

.feature-item {
  background: #f9f7ff;
  border-radius: 15px;
  padding: 25px 20px;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.feature-item:hover {
  border-color: #CB79DA;
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(98, 42, 151, 0.1);
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.feature-item h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

.feature-item p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

/* Кнопки действий */
.placeholder-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 40px;
}

.action-btn {
  background: white;
  border: 2px solid #eaeaea;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.action-btn.primary {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
}

.action-btn.primary:hover {
  box-shadow: 0 8px 25px rgba(98, 42, 151, 0.4);
}

@media (max-width: 768px) {
  .placeholder-content {
    padding: 40px 20px;
  }
  
  .placeholder-features {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .placeholder-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>