<template>
  <header class="header">
    <div class="container">
      <div class="logo-container">
        <img src="@/assets/logo_icon.png" alt="Logo" class="logo-icon" />
        <span class="logo">UniVerse</span>
      </div>
      
      <nav class="nav desktop-nav">
        <a href="#hero" class="nav-link" @click.prevent="scrollToSection('hero')">Главная</a>
        <a href="#about" class="nav-link" @click.prevent="scrollToSection('about')">О вузе</a>
        <a href="#events" class="nav-link" @click.prevent="scrollToSection('events')">Мероприятия</a>
        <a href="#news" class="nav-link" @click.prevent="scrollToSection('news')">Новости</a>
        <a href="#contacts" class="nav-link" @click.prevent="scrollToSection('contacts')">Контакты</a>
      </nav>
      
      <button class="btn-login desktop-btn" @click="handleAuthClick">
        {{ getAuthButtonText() }}
      </button>
      
      <button class="menu-toggle" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div class="mobile-menu" :class="{ 'active': isMenuOpen }" @click="closeMenu">
        <div class="mobile-menu-content" @click.stop>
          <nav class="mobile-nav">
            <a href="#hero" class="mobile-nav-link" @click="handleMobileLinkClick('hero')">Главная</a>
            <a href="#about" class="mobile-nav-link" @click="handleMobileLinkClick('about')">О вузе</a>
            <a href="#events" class="mobile-nav-link" @click="handleMobileLinkClick('events')">Мероприятия</a>
            <a href="#news" class="mobile-nav-link" @click="handleMobileLinkClick('news')">Новости</a>
            <a href="#contacts" class="mobile-nav-link" @click="handleMobileLinkClick('contacts')">Контакты</a>
            <button class="btn-login mobile-btn" @click="handleAuthClick">
              {{ getAuthButtonText() }}
            </button>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'

const isMenuOpen = ref(false)

const injectedOpenLoginModal = inject('openLoginModal')

onMounted(() => {
  console.log('Header mounted')
  console.log('injectedOpenLoginModal:', injectedOpenLoginModal)
})

const getAuthButtonText = () => {
  const token = localStorage.getItem('token')
  const userEmail = localStorage.getItem('user_email')
  
  if (!token) {
    return 'Авторизация'
  }
  
  // Если специалист
  if (userEmail === 'elisonkein@yahoo.com') {
    return 'Кабинет специалиста'
  }
  
  // Если абитуриент
  return 'Личный кабинет'
}

const handleAuthClick = () => {
  const token = localStorage.getItem('token')
  const userEmail = localStorage.getItem('user_email')
  
  if (token) {
    closeMenu()
    
    if (userEmail === 'elisonkein@yahoo.com') {
      window.location.href = '/specialist'
    } else {
      window.location.href = '/dashboard'
    }
    return
  }
  
  console.log('Кнопка "Авторизация" нажата')
  console.log('Функция injectedOpenLoginModal:', injectedOpenLoginModal)
  
  if (injectedOpenLoginModal && typeof injectedOpenLoginModal === 'function') {
    console.log('Вызываем injectedOpenLoginModal...')
    injectedOpenLoginModal()
    closeMenu()
  } else {
    console.log('Функция openLoginModal не найдена через inject')
    alert('Модальное окно входа не настроено. Проверьте HomeView.vue')
  }
}

const smoothScroll = inject('smoothScroll', (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
})

// Функция для плавной прокрутки к разделу
const scrollToSection = (sectionId) => {
  if (smoothScroll) {
    smoothScroll(sectionId)
  } else {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}

// Обработчик кликов для мобильного меню
const handleMobileLinkClick = (sectionId) => {
  closeMenu();
  setTimeout(() => {
    scrollToSection(sectionId);
  }, 300);
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : 'auto'
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = 'auto'
}
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  padding: 15px 0;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  position: relative;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  z-index: 1001;
}

.logo-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.logo {
  font-size: 26px;
  font-weight: 800;
  color: #622A97;
  letter-spacing: -0.5px;
  white-space: nowrap;
}

/* Десктопная навигация */
.desktop-nav {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  flex-grow: 1;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 16px;
  white-space: nowrap;
  padding: 8px 0;
  position: relative;
}

.nav-link:hover {
  color: #622A97;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

/* Кнопка авторизации для десктопа */
.desktop-btn {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
  white-space: nowrap;
  flex-shrink: 0;
}

.desktop-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(98, 42, 151, 0.4);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.menu-toggle span {
  display: block;
  width: 100%;
  height: 3px;
  background: #622A97;
  border-radius: 3px;
  transition: 0.3s;
}

/* Анимация бургера в крестик */
.menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Мобильное меню */
.mobile-menu {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-menu.active {
  opacity: 1;
  visibility: visible;
}

.mobile-menu-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background: white;
  padding: 100px 30px 30px;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.1);
}

.mobile-menu.active .mobile-menu-content {
  transform: translateX(0);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mobile-nav-link {
  color: #333;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: color 0.3s;
}

.mobile-nav-link:hover {
  color: #622A97;
}

.mobile-btn {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 16px;
  width: 100%;
  margin-top: 30px;
  cursor: pointer;
}

/* ========== МЕДИА-ЗАПРОСЫ ========== */

/* Планшеты (меньше 1024px) */
@media (max-width: 1024px) {
  .desktop-nav {
    gap: 20px;
  }
  
  .nav-link {
    font-size: 15px;
  }
  
  .desktop-btn {
    padding: 10px 25px;
    font-size: 15px;
  }
  
  .logo {
    font-size: 24px;
  }
  
  .logo-icon {
    width: 36px;
    height: 36px;
  }
}

/* Большие телефоны (меньше 900px) */
@media (max-width: 900px) {
  .desktop-nav,
  .desktop-btn {
    display: none;
  }
  
  .menu-toggle {
    display: flex;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .logo {
    font-size: 22px;
  }
  
  .logo-icon {
    width: 32px;
    height: 32px;
  }
}

/* Телефоны (меньше 600px) */
@media (max-width: 600px) {
  .header {
    padding: 12px 0;
  }
  
  .container {
    padding: 0 15px;
  }
  
  .logo {
    font-size: 20px;
  }
  
  .logo-icon {
    width: 28px;
    height: 28px;
  }
  
  .mobile-menu-content {
    width: 85%;
    padding: 90px 20px 20px;
  }
  
  .mobile-nav-link {
    font-size: 16px;
    padding: 10px 0;
  }
  
  .mobile-btn {
    padding: 12px;
    font-size: 15px;
    margin-top: 20px;
  }
}

/* Маленькие телефоны (меньше 400px) */
@media (max-width: 400px) {
  .logo {
    font-size: 18px;
  }
  
  .logo-container {
    gap: 8px;
  }
  
  .logo-icon {
    width: 24px;
    height: 24px;
  }
  
  .mobile-menu-content {
    width: 100%;
  }
}
</style>