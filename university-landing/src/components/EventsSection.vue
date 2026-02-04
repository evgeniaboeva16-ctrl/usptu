<template>
  <section class="events-section">
    <div class="container">
      <div class="title-section">
        <h1 class="main-title">Хочешь познакомиться с вузом?</h1>
        <p class="subtitle">Посети наши мероприятия:</p>
      </div>

      <div class="cards-container">
        <div class="cards-grid">
          <!-- Карточка 1 -->
          <div class="event-card">
            <h3 class="card-title">Вебинар от кафедры разработки</h3>
            <p class="card-description">
              Узнайте о современных технологиях и подходах в разработке ПО от ведущих преподавателей кафедры.
            </p>
            <button class="card-btn">Подробнее</button>
          </div>

          <!-- Карточка 2 -->
          <div class="event-card">
            <h3 class="card-title">Кем я буду в будущем?</h3>
            <p class="card-description">
              Профориентационная встреча с выпускниками и представителями компаний-партнёров.
            </p>
            <button class="card-btn">Подробнее</button>
          </div>

          <!-- Карточка 3 -->
          <div class="event-card">
            <h3 class="card-title">Для развития твоего творческого потенциала</h3>
            <p class="card-description">
              Мастер-классы и воркшопы по дизайну, фотографии, музыке и другим творческим направлениям.
            </p>
            <button class="card-btn">Подробнее</button>
          </div>

          <!-- Карточка 4 -->
          <div class="event-card">
            <h3 class="card-title">Тренинг от психолога</h3>
            <p class="card-description">
              Эффективные техники управления стрессом и развития эмоционального интеллекта.
            </p>
            <button class="card-btn">Подробнее</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.events-section {
  min-height: 90vh;
  padding: 40px 0;
  background: linear-gradient(135deg, #f9f7ff 0%, #f2eeff 100%);
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

.title-section {
  text-align: center;
  margin-bottom: 10px; /* Большой отступ снизу, чтобы окошки были НИЖЕ */
  padding-top: 10px;
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
}

.subtitle {
  font-size: 1.5rem;
  color: #666;
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;
}

/* КОНТЕЙНЕР ДЛЯ ОКОШЕК НИЖЕ */
.cards-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 1fr; /* Важно: все строки одинаковой высоты */
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  align-items: stretch; /* Растягиваем карточки */
}

.event-card {
  background: white;
  border-radius: 20px;
  padding: 35px 25px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(98, 42, 151, 0.15);
  display: flex;
  flex-direction: column;
  height: 100%; /* Занимает всю доступную высоту */
  min-height: 420px; /* Минимальная высота для всех карточек */
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #622A97, #CB79DA);
}

.event-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(98, 42, 151, 0.2);
}

.card-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 15px 0;
  line-height: 1.4;
  flex-shrink: 0; /* Не сжимается */
}

.card-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin: 0 0 25px 0;
  flex-grow: 1; /* Занимает доступное пространство */
  display: -webkit-box;
  -webkit-line-clamp: 4; /* Ограничиваем количество строк */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-btn {
  align-self: flex-start;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  white-space: nowrap;
  margin-top: auto; /* Прижимаем кнопку к низу */
  flex-shrink: 0; /* Не сжимается */
}

.card-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(98, 42, 151, 0.4);
}

/* Адаптивность */
@media (max-width: 1200px) {
  .cards-grid {
    gap: 25px;
  }
  
  .event-card {
    padding: 30px 20px;
    min-height: 260px;
  }
}

@media (max-width: 1024px) {
  .main-title {
    font-size: 2.6rem;
  }
  
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    max-width: 800px;
  }
  
  .title-section {
    margin-bottom: 60px;
  }
  
  .event-card {
    min-height: 250px;
  }
}

@media (max-width: 768px) {
  .events-section {
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
  
  .cards-grid {
    gap: 25px;
  }
  
  .event-card {
    padding: 25px 20px;
    min-height: 240px;
  }
  
  .card-title {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }
  
  .card-description {
    font-size: 0.9rem;
    margin-bottom: 20px;
    -webkit-line-clamp: 3;
  }
  
  .card-btn {
    padding: 10px 25px;
    font-size: 0.95rem;
  }
}

@media (max-width: 600px) {
  .cards-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    gap: 20px;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .event-card {
    min-height: 220px;
  }
}

@media (max-width: 400px) {
  .main-title {
    font-size: 1.8rem;
  }
  
  .event-card {
    padding: 20px 18px;
    min-height: 210px;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .card-description {
    font-size: 0.85rem;
  }
}
</style>