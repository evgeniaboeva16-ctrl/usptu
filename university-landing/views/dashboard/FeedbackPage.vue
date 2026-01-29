<template>
  <div class="feedback-page">
    <!-- Заголовок -->
    <div class="page-header">
      <h2>Обратная связь</h2>
      <p>Раздел находится в разработке</p>
    </div>

    <!-- Контент в разработке -->
    <div class="construction-container">
      <div class="construction-card">
        <div class="construction-icon">🚧</div>
        <h3>Скоро здесь будет обратная связь!</h3>
        <p class="construction-text">
          Мы работаем над созданием удобной системы для ваших вопросов, 
          предложений и отзывов о мероприятиях.
        </p>
        
        <!-- Предварительный обзор функций -->
        <div class="features-preview">
          <h4>Что будет доступно:</h4>
          <ul class="features-list">
            <li>📝 Отправка отзывов о мероприятиях</li>
            <li>⭐ Оценка качества организации</li>
            <li>💬 Вопросы специалистам УГНТУ</li>
            <li>📋 Предложения по улучшению системы</li>
          </ul>
        </div>

        <!-- Временные контакты -->
        <div class="temp-contacts">
          <h4>Пока вы можете связаться с нами:</h4>
          <div class="contact-cards">
            <div class="contact-card">
              <div class="contact-icon">📧</div>
              <h5>Email</h5>
              <p>abiturient@ugntu.ru</p>
            </div>
            <div class="contact-card">
              <div class="contact-icon">📞</div>
              <h5>Телефон</h5>
              <p>+7 (000) 000-00-00</p>
            </div>
            <div class="contact-card">
              <div class="contact-icon">🏢</div>
              <h5>Приемная комиссия</h5>
              <p>г. Уфа, ул. Космонавтов, 1</p>
            </div>
          </div>
        </div>

        <router-link to="/dashboard" class="btn-back">
          ← Вернуться на главную
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.feedback-page {
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-header p {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.construction-container {
  max-width: 800px;
  margin: 0 auto 40px;
}

.construction-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border: 2px dashed #ff9800;
  text-align: center;
}

.construction-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.construction-card h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
}

.construction-text {
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.features-preview {
  text-align: left;
  background: #f9f7ff;
  padding: 25px;
  border-radius: 15px;
  margin: 30px 0;
  border: 1px solid #f0e6f7;
}

.features-preview h4 {
  color: #622A97;
  font-size: 1.3rem;
  margin-bottom: 15px;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  color: #555;
  margin-bottom: 12px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.features-list li:before {
  font-size: 1.2rem;
}

.temp-contacts {
  margin: 30px 0;
}

.temp-contacts h4 {
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 20px;
  text-align: center;
}

.contact-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.contact-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(98, 42, 151, 0.1);
}

.contact-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #622A97;
}

.contact-card h5 {
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.contact-card p {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.btn-back {
  display: inline-block;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  text-decoration: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}

.btn-back:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(98, 42, 151, 0.3);
}

.progress-section {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 15px;
}

.progress-section h4 {
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.progress-bar {
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.progress-text {
  color: #4CAF50;
  font-weight: 600;
  margin-bottom: 5px;
}

.eta-text {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .construction-card {
    padding: 25px 20px;
  }
  
  .construction-card h3 {
    font-size: 1.5rem;
  }
  
  .features-preview {
    padding: 20px;
  }
  
  .contact-cards {
    grid-template-columns: 1fr;
  }
  
  .contact-card {
    padding: 20px;
  }
  
  .progress-section {
    padding: 20px;
  }
}
</style>