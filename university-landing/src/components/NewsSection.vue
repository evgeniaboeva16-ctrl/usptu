<template>
  <section class="news-section">
    <div class="container">
      <div class="title-section">
        <h1 class="main-title">Новости</h1>
        <p class="subtitle">Актуальные события УГНТУ</p>
      </div>

      <div class="content-container">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Загружаем новости...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>⚠️ {{ error }}</p>
          <button @click="fetchNews" class="retry-btn">Попробовать снова</button>
        </div>

        <div v-else-if="newsItems.length === 0" class="empty-state">
          <p>Новостей пока нет.</p>
        </div>

        <div v-else class="news-grid">
          <article v-for="item in newsItems" :key="item.id" class="news-card">
            <!-- Блок с датой -->
            <div class="news-meta">
              <time class="news-date" :datetime="item.date">{{ formatDate(item.date) }}</time>
              <span v-if="item.category" class="news-category">{{ item.category }}</span>
            </div>

            <h3 class="news-title">
              <a :href="item.url" target="_blank" rel="noopener noreferrer" class="news-link">
                {{ item.title }}
              </a>
            </h3>

            <p v-if="item.excerpt" class="news-excerpt">{{ truncateText(item.excerpt, 120) }}</p>

            <div class="news-footer">
              <a :href="item.url" target="_blank" rel="noopener noreferrer" class="read-more-btn">
                Читать подробнее 
              </a>
            </div>
          </article>
        </div>
      </div>

      <div v-if="!isLoading && !error && newsItems.length > 0" class="section-footer">
        <a href="https://rusoil.net/ru/news" target="_blank" rel="noopener noreferrer" class="all-news-link">
          Все новости на сайте RUSOIL
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const newsItems = ref([])
const isLoading = ref(true)
const error = ref(null)

const API_URL = 'http://localhost:3001/api/news/rusoil'

const fetchNews = async () => {
  isLoading.value = true
  error.value = null
  console.log('Загрузка новостей...')

  try {
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error(`Ошибка сети: ${response.status}`)
    }

    const data = await response.json()

    if (data.success && Array.isArray(data.news)) {
      newsItems.value = data.news.slice(0, 4)
    } else {
      throw new Error('Неверный формат данных от сервера')
    }

  } catch (err) {
    console.error('Ошибка загрузки новостей:', err)
    error.value = 'Не удалось загрузить последние новости. Пожалуйста, попробуйте позже.'
    
    // Запасной вариант
    newsItems.value = getFallbackNews()
    
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const getFallbackNews = () => {
  return [
    {
      id: 1,
      title: "День открытых дверей в УГНТУ",
      excerpt: "Приглашаем всех абитуриентов и их родителей на традиционный день открытых дверей...",
      url: "https://rusoil.net/ru/news",
      date: new Date().toISOString().split('T')[0],
      category: "Событие"
    },
    {
      id: 2,
      title: "Запуск новой лаборатории нефтегазового оборудования",
      excerpt: "В рамках программы модернизации материально-технической базы университета...",
      url: "https://rusoil.net/ru/news",
      date: "2024-11-28",
      category: "Развитие"
    },
    {
      id: 3,
      title: "Студенты УГНТУ победили на всероссийском хакатоне",
      excerpt: "Команда факультета информационных технологий заняла первое место...",
      url: "https://rusoil.net/ru/news",
      date: "2024-11-20",
      category: "Достижения"
    },
    {
      id: 4,
      title: "Заключено новое соглашение о партнерстве с промышленной компанией",
      excerpt: "Университет расширяет сеть партнеров для организации практик и трудоустройства выпускников...",
      url: "https://rusoil.net/ru/news",
      date: "2024-11-15",
      category: "Сотрудничество"
    }
  ]
}

onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
.news-section {
  min-height: 100vh;
  padding: 15px 0;
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
  margin-bottom: 80px; /* Большой отступ снизу */
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

.content-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 карточки в ряд */
  gap: 30px;
  width: 100%;
  max-width: 1200px;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  width: 100%;
}

.spinner {
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

.error-state p {
  color: #d32f2f;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.retry-btn {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(98, 42, 151, 0.3);
}

.news-card {
  background: white;
  border-radius: 20px;
  padding: 30px 25px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(98, 42, 151, 0.15);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 280px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.news-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #622A97, #CB79DA);
}

.news-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(98, 42, 151, 0.15);
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.news-date {
  color: #666;
  font-weight: 500;
}

.news-category {
  background: #f0e6f7;
  color: #622A97;
  padding: 6px 15px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.8rem;
}

.news-title {
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 15px;
  flex-grow: 1;
}

.news-link {
  color: #222;
  text-decoration: none;
  transition: color 0.2s;
}

.news-link:hover {
  color: #622A97;
}

.news-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 25px;
  font-size: 0.95rem;
  flex-grow: 2;
}

.news-footer {
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.read-more-btn {
  color: #622A97;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s;
}

.read-more-btn:hover {
  color: #4a1f72;
  transform: translateX(5px);
}

.read-more-btn::after {
  content: "→";
  margin-left: 8px;
  transition: transform 0.3s;
}

.read-more-btn:hover::after {
  transform: translateX(3px);
}

.section-footer {
  text-align: center;
  margin-top: 60px;
}

.all-news-link {
  display: inline-block;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 14px 40px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(98, 42, 151, 0.3);
  position: relative;
  overflow: hidden;
}

.all-news-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(98, 42, 151, 0.4);
  color: white;
}

.all-news-link::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.all-news-link:hover::after {
  left: 100%;
}

/* Стрелка после текста */
.all-news-link::before {
  margin-left: 10px;
  font-weight: 700;
  transition: transform 0.3s;
}

.all-news-link:hover::before {
  transform: translateX(5px);
}

@media (max-width: 1200px) {
  .news-grid {
    gap: 25px;
  }
  
  .news-card {
    padding: 25px 20px;
    min-height: 260px;
  }
}

@media (max-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    max-width: 800px;
  }
  
  .main-title {
    font-size: 2.6rem;
  }
  
  .title-section {
    margin-bottom: 60px;
  }
}

@media (max-width: 768px) {
  .news-section {
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
  
  .news-grid {
    gap: 25px;
  }
  
  .news-card {
    padding: 25px 20px;
    min-height: 240px;
  }
  
  .news-title {
    font-size: 1.2rem;
  }
}

@media (max-width: 600px) {
  .news-grid {
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
  
  .news-card {
    min-height: 220px;
  }
}

@media (max-width: 400px) {
  .main-title {
    font-size: 1.8rem;
  }
  
  .news-card {
    padding: 20px 18px;
  }
  
  .news-title {
    font-size: 1.1rem;
  }
  
  .news-excerpt {
    font-size: 0.9rem;
  }
}
</style>