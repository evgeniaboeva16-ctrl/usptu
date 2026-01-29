<template>
  <section class="contacts-section">
    <div class="container">
      <!-- Заголовок секции -->
      <div class="title-section">
        <h1 class="main-title">Контакты</h1>
        <p class="subtitle">Свяжитесь с нами</p>
      </div>

      <div class="content-container">
        <!-- Левая колонка: Контактная информация (1/3 ширины) -->
        <div class="contacts-info">
          <div class="info-card">
            <!-- Логотип и название -->
            <div class="university-header">
              <div class="university-icon">
                <img src="C:\Users\evgen\university-landing\src\assets\2.png" alt="Университет" class="icon-img">
              </div>
              <h2 class="university-name">ФГБОУ ВО УГНТУ г. Уфа</h2>
            </div>

            <div class="contact-details">
              <div class="contact-item">
                <div class="university-icon">
                <img src="C:\Users\evgen\university-landing\src\assets\Снимок экрана 2025-12-15 213957_resized.png" alt="Адрес" class="icon-img">
              </div>
                <div class="contact-content">
                  <h3 class="contact-label">Адрес</h3>
                  <p class="contact-text">450062, г. Уфа, ул. Первомайская, 14, корпус УГНТУ № 8 (бывший ДК Орджоникидзе), каб. 301, 308</p>
                </div>
              </div>

              <div class="contact-item">
                <div class="university-icon">
                <img src="C:\Users\evgen\university-landing\src\assets\3.png" alt="телефон" class="icon-img">
              </div>
                <div class="contact-content">
                  <h3 class="contact-label">Телефон</h3>
                  <a href="tel:+78005514528" class="contact-link">8 (800) 55-14-528</a>
                </div>
              </div>

              <div class="contact-item">
                <div class="university-icon">
                <img src="C:\Users\evgen\university-landing\src\assets\4.png" alt="сайт" class="icon-img">
              </div>
                <div class="contact-content">
                  <h3 class="contact-label">Сайт</h3>
                  <a href="https://pk.rusoil.net/" target="_blank" class="contact-link">www.pk.rusoil.net</a>
                </div>
              </div>

              <div class="contact-item">
                <div class="university-icon">
                <img src="C:\Users\evgen\university-landing\src\assets\5.png" alt="email" class="icon-img">
              </div>
                <div class="contact-content">
                  <h3 class="contact-label">E-mail</h3>
                  <a href="mailto:pkugntu@mail.ru" class="contact-link">pkugntu@mail.ru</a>
                </div>
              </div>
            </div>

            <div class="additional-info">
              <div class="info-block">
                <h3 class="info-title">Приемная комиссия</h3>
                <p class="info-text">Основной контакт для абитуриентов по вопросам поступления</p>
              </div>
              
              <div class="info-block">
                <h3 class="info-title">Режим работы</h3>
                <p class="info-text">Пн-Пт: 10:00-17:00<br>Сб: 10:00-13:00<br>Вс: выходной</p>
              </div>
            </div>

            <button class="route-btn" @click="openRouteInMaps">
              <span class="route-text">Построить маршрут</span>
            </button>
          </div>
        </div>

        <div class="map-container">
          <!-- Контейнер для карты -->
          <div class="map-wrapper">
            <div ref="mapContainer" class="map" id="university-map"></div>
            
            <div class="map-controls">
              <button class="map-control-btn" @click="zoomIn" title="Увеличить">
                <span class="control-icon">➕</span>
              </button>
              <button class="map-control-btn" @click="zoomOut" title="Уменьшить">
                <span class="control-icon">➖</span>
              </button>
              <button class="map-control-btn" @click="resetView" title="Сбросить вид">
                <span class="control-icon">🔄</span>
              </button>
            </div>

            <div class="map-marker-info" v-if="showMarkerInfo">
              <div class="marker-content">
                <h3>Уфимский государственный нефтяной технический университет</h3>
                <p>ул. Первомайская, 14, Уфа</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const YANDEX_API_KEY = '4b4590e9-03d1-422e-b13b-fa15af85c4b0'

const ugntuCoords = {
  lat: 54.818628,
  lng: 56.058603
}

const mapContainer = ref(null)
let map = null
let marker = null
const showMarkerInfo = ref(true)

const initMap = () => {
  if (!mapContainer.value) return

  if (!window.ymaps) {
    console.error('Yandex Maps API не загружен')
    loadYandexMaps()
    return
  }

  window.ymaps.ready(() => {
    map = new window.ymaps.Map(mapContainer.value, {
      center: [ugntuCoords.lat, ugntuCoords.lng],
      zoom: 16,
      controls: ['zoomControl', 'fullscreenControl']
    })

    marker = new window.ymaps.Placemark(
      [ugntuCoords.lat, ugntuCoords.lng],
      {
        balloonContent: `
          <div style="padding: 10px; max-width: 300px;">
            <h3 style="margin: 0 0 10px 0; color: #622A97;">Уфимский государственный нефтяной технический университет</h3>
            <p style="margin: 0 0 5px 0; color: #666;">ул. Первомайская, 14, Уфа</p>
            <p style="margin: 0; font-size: 12px; color: #999;">
              Корпус № 8 (бывший ДК Орджоникидзе)
            </p>
          </div>
        `,
        hintContent: 'УГНТУ'
      },
      {
        preset: 'islands#blueGovernmentIcon',
        iconColor: '#622A97'
      }
    )

    map.geoObjects.add(marker)

    marker.events.add('click', () => {
      marker.balloon.open()
    })

    setTimeout(() => {
      marker.balloon.open()
    }, 1000)

    window.addEventListener('resize', () => {
      if (map) {
        map.container.fitToViewport()
      }
    })
  })
}

const loadYandexMaps = () => {
  const script = document.createElement('script')
  script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_API_KEY}&lang=ru_RU`
  script.onload = initMap
  script.onerror = () => {
    console.error('Ошибка загрузки Яндекс.Карт')
    showFallbackMap()
  }
  document.head.appendChild(script)
}

const showFallbackMap = () => {
  if (mapContainer.value) {
    mapContainer.value.innerHTML = `
      <div class="fallback-map">
        <div class="fallback-content">
          <div class="fallback-icon">🗺️</div>
          <h3>Уфимский государственный нефтяной технический университет</h3>
          <p>ул. Первомайская, 14, Уфа</p>
          <a href="https://yandex.ru/maps/org/ufimskiy_gosudarstvenny_neftyanoy_tekhnicheskiy_universitet/140995798578/?ll=56.059281%2C54.818525&z=16" 
             target="_blank" 
             class="fallback-link">
            Открыть карту в Яндекс.Картах →
          </a>
        </div>
      </div>
    `
  }
}

const zoomIn = () => {
  if (map) {
    const currentZoom = map.getZoom()
    map.setZoom(currentZoom + 1, { duration: 300 })
  }
}

const zoomOut = () => {
  if (map) {
    const currentZoom = map.getZoom()
    map.setZoom(currentZoom - 1, { duration: 300 })
  }
}

const resetView = () => {
  if (map) {
    map.setCenter([ugntuCoords.lat, ugntuCoords.lng], 16)
  }
}

const openRouteInMaps = () => {
  const url = `https://yandex.ru/maps/?rtext=~${ugntuCoords.lat},${ugntuCoords.lng}&rtt=auto`
  window.open(url, '_blank')
}

onMounted(() => {
  setTimeout(() => {
    loadYandexMaps()
  }, 100)
})

onUnmounted(() => {
  if (map) {
    map.destroy()
  }
})
</script>

<style scoped>
.contacts-section {
  min-height: 100vh;
  padding: 15px 0;
  background: white;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f9f7ff 0%, #f2eeff 100%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

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

.content-container {
  display: grid;
  grid-template-columns: 1fr 2fr; /* 1/3 и 2/3 ширины */
  gap: 40px;
  flex: 1;
}

.contacts-info {
  display: flex;
  flex-direction: column;
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 35px 30px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(98, 42, 151, 0.15);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.university-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 35px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0e6f7;
}

.university-icon {
  font-size: 3rem;
}

.university-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  line-height: 1.3;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 35px;
}

.contact-item {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.contact-icon {
  font-size: 1.8rem;
  color: #622A97;
  flex-shrink: 0;
  margin-top: 5px;
}

.contact-content {
  flex: 1;
}

.contact-label {
  font-size: 1rem;
  font-weight: 600;
  color: #622A97;
  margin-bottom: 5px;
}

.contact-text {
  color: #333;
  line-height: 1.5;
  font-size: 1.05rem;
}

.contact-link {
  color: #622A97;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.3s;
  display: inline-block;
}

.contact-link:hover {
  color: #4a1f72;
  text-decoration: underline;
  transform: translateX(3px);
}

.additional-info {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 35px;
  padding-top: 25px;
  border-top: 2px solid #f0e6f7;
}

.info-block {
  background: linear-gradient(135deg, #f9f7ff, #f2eeff);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(98, 42, 151, 0.1);
}

.info-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.info-text {
  color: #666;
  line-height: 1.5;
  font-size: 0.95rem;
}

.route-btn {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: auto;
  box-shadow: 0 8px 25px rgba(98, 42, 151, 0.3);
}

.route-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(98, 42, 151, 0.4);
}

.route-icon {
  font-size: 1.3rem;
}

.route-text {
  font-size: 1rem;
}

.map-container {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(98, 42, 151, 0.15);
}

.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px;
}

.map {
  width: 100%;
  height: 100%;
  min-height: 600px;
}

.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.map-control-btn {
  background: white;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  font-size: 1.2rem;
}

.map-control-btn:hover {
  background: #622A97;
  color: white;
  transform: scale(1.1);
}

.control-icon {
  display: block;
}

.map-marker-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 15px 20px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  border: 1px solid rgba(98, 42, 151, 0.2);
  max-width: 400px;
}

.marker-content h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
}

.marker-content p {
  font-size: 0.9rem;
  color: #666;
}

.fallback-map {
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: linear-gradient(135deg, #622A97, #CB79DA);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 40px;
}

.fallback-content {
  max-width: 500px;
}

.fallback-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.fallback-link {
  display: inline-block;
  background: white;
  color: #622A97;
  padding: 12px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 20px;
  transition: all 0.3s;
}

.fallback-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* Адаптивность */
@media (max-width: 1200px) {
  .content-container {
    gap: 30px;
  }
  
  .info-card {
    padding: 30px 25px;
  }
  
  .map-wrapper,
  .map {
    min-height: 550px;
  }
}

@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .map-wrapper,
  .map {
    min-height: 500px;
  }
  
  .main-title {
    font-size: 2.6rem;
  }
  
  .title-section {
    margin-bottom: 60px;
  }
}

@media (max-width: 768px) {
  .contacts-section {
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
  
  .info-card {
    padding: 25px 20px;
  }
  
  .university-header {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .university-icon {
    font-size: 2.5rem;
  }
  
  .contact-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
  }
  
  .contact-icon {
    margin-top: 0;
  }
  
  .map-wrapper,
  .map {
    min-height: 400px;
  }
  
  .map-controls {
    top: 10px;
    right: 10px;
  }
  
  .map-control-btn {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}

@media (max-width: 600px) {
  .main-title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .university-name {
    font-size: 1.3rem;
  }
  
  .contact-link {
    font-size: 1rem;
  }
  
  .route-btn {
    padding: 12px 20px;
    font-size: 1rem;
  }
  
  .map-wrapper,
  .map {
    min-height: 350px;
  }
}

@media (max-width: 400px) {
  .main-title {
    font-size: 1.8rem;
  }
  
  .info-card {
    padding: 20px 18px;
  }
  
  .contact-text {
    font-size: 1rem;
  }
}
</style>