<template>
  <div class="qr-page">
    <div class="page-header">
      <h2>Мой QR код</h2>
    </div>

    <div class="qr-container">
      <div class="qr-card">
        <div class="qr-header">
          <h3>Уникальный идентификатор абитуриента</h3>
        </div>
        
        <div class="qr-code-wrapper">
          <div ref="qrcode" class="qrcode"></div>
        </div>
        
        <div class="qr-actions">
          <button class="btn-download" @click="downloadQR" :disabled="!qrLoaded">
            📥 Скачать QR код
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const qrcode = ref(null)
const userId = ref('')
const qrStatus = ref('Загрузка...')
const qrLoaded = ref(false)
let QRCodeModule = null

onMounted(() => {
  loadQRData()
})

onUnmounted(() => {
  // Очистка при необходимости
})

const loadQRData = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {}
  userId.value = user.id || 'guest'
  
  // Динамически импортируем qrcode только на клиенте
  if (typeof window !== 'undefined') {
    import('qrcode').then(module => {
      QRCodeModule = module.default
      generateQRCode()
    }).catch(error => {
      console.error('Ошибка загрузки QRCode модуля:', error)
      qrStatus.value = 'Ошибка загрузки библиотеки'
    })
  }
}

const generateQRCode = () => {
  if (!qrcode.value || !QRCodeModule) {
    qrStatus.value = 'Ошибка: QRCode не загружен'
    return
  }
  
  const qrData = getQRData()
  const qrString = JSON.stringify(qrData)
  
  QRCodeModule.toDataURL(qrString, {
    width: 250,
    margin: 2,
    color: {
      dark: '#622A97',
      light: '#ffffff'
    }
  })
  .then(qrImage => {
    qrcode.value.innerHTML = `<img src="${qrImage}" alt="QR Code">`
    qrStatus.value = 'Активен'
    qrLoaded.value = true
  })
  .catch(error => {
    console.error('Ошибка генерации QR кода:', error)
    qrStatus.value = 'Ошибка генерации'
  })
}

const getQRData = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {}
  
  return {
    type: 'permanent_applicant',
    userId: user.id || 'guest',
    fullName: user.full_name || 'Абитуриент УГНТУ',
    timestamp: Date.now(),
    institution: 'Уфимский государственный нефтяной технический университет',
    purpose: 'Идентификация абитуриента'
  }
}

const downloadQR = () => {
  if (!qrLoaded.value || !qrcode.value) return
  
  const qrImg = qrcode.value.querySelector('img')
  if (qrImg) {
    const link = document.createElement('a')
    link.href = qrImg.src
    link.download = `ugntu-qr-${userId.value}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const refreshQR = () => {
  qrLoaded.value = false
  qrStatus.value = 'Обновление...'
  generateQRCode()
}
</script>

<style scoped>
.qr-page {
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

.qr-container {
  max-width: 600px;
  margin: 0 auto;
}

.qr-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(98, 42, 151, 0.15);
  text-align: center;
}

.qr-header {
  margin-bottom: 30px;
}

.qr-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.qr-header p {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.qr-code-wrapper {
  background: linear-gradient(135deg, #f9f7ff, #f2eeff);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid rgba(98, 42, 151, 0.1);
}

.qrcode {
  display: inline-block;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.qrcode img {
  width: 200px;
  height: 200px;
  display: block;
  border-radius: 10px;
}

.qr-info {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.user-id,
.qr-timer {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  padding: 10px 20px;
  background: white;
  border-radius: 10px;
  border: 2px solid #f0e6f7;
}

.qr-timer {
  color: #622A97;
  background: linear-gradient(90deg, rgba(98, 42, 151, 0.1), rgba(203, 121, 218, 0.1));
}

.qr-instructions {
  text-align: left;
  margin-bottom: 30px;
  padding: 25px;
  background: #f9f9f9;
  border-radius: 15px;
}

.qr-instructions h4 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
}

.qr-instructions ol {
  padding-left: 20px;
  margin: 0;
}

.qr-instructions li {
  color: #555;
  margin-bottom: 10px;
  line-height: 1.5;
  font-size: 0.95rem;
}

.qr-instructions li:last-child {
  margin-bottom: 0;
}

/* Кнопки действий */
.qr-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-download,
.btn-share,
.btn-refresh {
  padding: 12px 25px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 180px;
}

.btn-download {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
}

.btn-download:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(98, 42, 151, 0.3);
}

.btn-share {
  background: white;
  color: #622A97;
  border: 2px solid #622A97;
}

.btn-share:hover {
  background: #f9f7ff;
}

.btn-refresh {
  background: #f0f0f0;
  color: #333;
}

.btn-refresh:hover {
  background: #e0e0e0;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.qr-timer {
  animation: pulse 2s infinite;
}

@media (max-width: 768px) {
  .qr-page {
    padding: 15px;
  }
  
  .page-header h2 {
    font-size: 1.8rem;
  }
  
  .qr-card {
    padding: 25px 20px;
  }
  
  .qr-header h3 {
    font-size: 1.3rem;
  }
  
  .qrcode img {
    width: 180px;
    height: 180px;
  }
  
  .qr-info {
    flex-direction: column;
    gap: 15px;
  }
  
  .qr-actions {
    flex-direction: column;
  }
  
  .btn-download,
  .btn-share,
  .btn-refresh {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-header h2 {
    font-size: 1.6rem;
  }
  
  .page-header p {
    font-size: 1rem;
  }
  
  .qr-code-wrapper {
    padding: 20px;
  }
  
  .qrcode img {
    width: 160px;
    height: 160px;
  }
  
  .qr-instructions {
    padding: 20px;
  }
  
  .qr-instructions h4 {
    font-size: 1.1rem;
  }
  
  .qr-instructions li {
    font-size: 0.9rem;
  }
}


@media (max-width: 768px) {
  .qr-page {
    padding: 15px 10px;
  }
  
  .page-header {
    margin-bottom: 25px;
  }
  
  .page-header h2 {
    font-size: 1.8rem;
    margin-bottom: 12px;
  }
  
  .page-header p {
    font-size: 1.05rem;
    padding: 0 5px;
  }
  
  .qr-card {
    padding: 20px 15px;
    border-radius: 16px;
  }
  
  .qr-header h3 {
    font-size: 1.3rem;
  }
  
  .qr-header p {
    font-size: 0.95rem;
  }
  
  .qr-code-wrapper {
    padding: 20px 10px;
    border-radius: 12px;
  }
  
  .qrcode {
    padding: 12px;
    border-radius: 10px;
    margin-bottom: 12px;
  }
  
  .qrcode img {
    width: 180px;
    height: 180px;
    border-radius: 6px;
  }
  
  .qr-info {
    flex-direction: row;
    gap: 12px;
    margin-top: 15px;
  }
  
  .user-id,
  .qr-timer {
    font-size: 0.9rem;
    padding: 8px 14px;
    min-width: 120px;
    flex: 1;
  }
  
  .qr-instructions {
    padding: 18px;
    margin-bottom: 20px;
    border-radius: 10px;
    font-size: 0.9rem;
  }
  
  .qr-instructions h4 {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }
  
  .qr-instructions li {
    font-size: 0.9rem;
    margin-bottom: 6px;
  }
  
  .qr-actions {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
  
  .btn-download,
  .btn-share,
  .btn-refresh {
    width: 100%;
    max-width: 300px;
    min-width: unset;
    padding: 14px 20px;
    font-size: 0.95rem;
  }
}
</style>