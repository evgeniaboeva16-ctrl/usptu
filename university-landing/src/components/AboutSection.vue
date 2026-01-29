<template>
  <section class="about-section">
    <div class="container">
      <div class="title-section">
        <h1 class="main-title">Об УГНТУ</h1>
        <p class="subtitle">Узнай больше о нашем университете</p>
      </div>

      <div class="content-container">
        <div class="about-grid">
          <!-- Левая часть - преимущества -->
          <div class="features-column">
            <div class="feature-item">
              <div class="feature-icon">🎓</div>
              <div class="feature-content">
                <h3 class="feature-title">Качественное образование</h3>
                <p class="feature-text">Современные программы обучения, соответствующие требованиям рынка труда</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">👨‍🏫</div>
              <div class="feature-content">
                <h3 class="feature-title">Опытные преподаватели</h3>
                <p class="feature-text">Профессионалы с практическим опытом в своих областях знаний</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">🏢</div>
              <div class="feature-content">
                <h3 class="feature-title">Современная инфраструктура</h3>
                <p class="feature-text">Новые лаборатории, библиотеки и спортивные комплексы для студентов</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">🤝</div>
              <div class="feature-content">
                <h3 class="feature-title">Партнерство с компаниями</h3>
                <p class="feature-text">Стажировки и трудоустройство в ведущих компаниях-партнерах</p>
              </div>
            </div>
          </div>

          <div class="stats-column">
            <div class="stats-card">
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-number">25000+</div>
                  <div class="stat-label">Студентов</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">1000+</div>
                  <div class="stat-label">Преподавателей</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">300+</div>
                  <div class="stat-label">Направлений</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">95%</div>
                  <div class="stat-label">Трудоустройство</div>
                </div>
              </div>
            </div>

            <div class="info-card">
              <h3 class="info-title">Наша миссия</h3>
              <p class="info-text">— подготовка высококвалифицированных специалистов, способных решать сложные инженерные и технологические задачи, быть лидерами в своих профессиональных областях. Образование в УГНТУ — это не только получение знаний, но и формирование ответственного, творческого мышления, развитие практических навыков, которые станут надежной основой для вашего успешного будущего и карьерного роста.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.about-section {
  min-height: 100vh;
  padding: 15px 0;
  background: white;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ЗАГОЛОВОК В САМОМ ВЕРХУ, ПО ЦЕНТРУ */
.title-section {
  text-align: center;
  margin-bottom: 80px;
  padding-top: 40px;
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  color: #333;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.5rem;
  color: #666;
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;
}

/* КОНТЕЙНЕР ДЛЯ КОНТЕНТА НИЖЕ */
.content-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  width: 100%;
  max-width: 1200px;
}

/* Левая колонка - преимущества */
.features-column {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 25px;
  background: linear-gradient(135deg, #f9f7ff, #f2eeff);
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(98, 42, 151, 0.1);
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(98, 42, 151, 0.15);
  background: white;
}

.feature-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.feature-text {
  color: #666;
  line-height: 1.5;
  font-size: 0.95rem;
}

/* Правая колонка - статистика и информация */
.stats-column {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.stats-card {
  background: linear-gradient(135deg, #622A97, #CB79DA);
  border-radius: 20px;
  padding: 40px;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 500;
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 35px 30px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(98, 42, 151, 0.15);
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
}

.info-text {
  color: #666;
  line-height: 1.6;
  margin-bottom: 25px;
  font-size: 1rem;
}

.info-btn {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.info-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(98, 42, 151, 0.3);
}

/* Адаптивность */
@media (max-width: 1024px) {
  .about-grid {
    gap: 40px;
  }
  
  .stats-grid {
    gap: 25px;
  }
  
  .stat-number {
    font-size: 2.2rem;
  }
}

@media (max-width: 900px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 40px;
    max-width: 700px;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .title-section {
    margin-bottom: 60px;
  }
}

@media (max-width: 768px) {
  .about-section {
    padding: 60px 0;
  }
  
  .main-title {
    font-size: 2.2rem;
  }
  
  .subtitle {
    font-size: 1.3rem;
  }
  
  .title-section {
    margin-bottom: 50px;
    padding-top: 20px;
  }
  
  .feature-item {
    padding: 20px;
  }
  
  .feature-icon {
    font-size: 2rem;
  }
  
  .stats-card {
    padding: 30px;
  }
  
  .info-card {
    padding: 25px 20px;
  }
}

@media (max-width: 600px) {
  .about-grid {
    gap: 30px;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .feature-title {
    font-size: 1.1rem;
  }
  
  .feature-text {
    font-size: 0.9rem;
  }
}

@media (max-width: 400px) {
  .main-title {
    font-size: 1.8rem;
  }
  
  .feature-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 15px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}
</style>