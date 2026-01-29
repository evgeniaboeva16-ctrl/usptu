<template>
  <div class="home-page">
    <Header />
    <section id="hero">
      <HeroSection />
    </section>
    <section id="about">
      <AboutSection />
    </section>
    <section id="events">
      <EventsSection />
    </section>
    <section id="news">
      <NewsSection />
    </section>
    <section id="contacts">
      <ContactsSection />
    </section>
    <Footer />
    
    <!-- Используем v-if без :isVisible -->
    <LoginModal 
      v-if="showLoginModal"
      @close="closeLoginModal"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import EventsSection from '@/components/EventsSection.vue'
import NewsSection from '@/components/NewsSection.vue'
import ContactsSection from '@/components/ContactsSection.vue'
import Footer from '@/components/Footer.vue'
import LoginModal from '@/components/LoginModal.vue'

// Для отладки
onMounted(() => {
  console.log('HomeView загружен, LoginModal импортирован:', !!LoginModal)
})

const showLoginModal = ref(false)

// Предоставляем функцию открытия логина
provide('openLoginModal', () => {
  console.log('openLoginModal вызван, устанавливаем showLoginModal = true')
  showLoginModal.value = true
  document.body.style.overflow = 'hidden'
  
  // Для отладки
  console.log('Текущее значение showLoginModal:', showLoginModal.value)
})

// Функция закрытия модального окна логина
const closeLoginModal = () => {
  console.log('closeLoginModal вызван, устанавливаем showLoginModal = false')
  showLoginModal.value = false
  document.body.style.overflow = 'auto'
}

// Обработка успешного входа
const handleLoginSuccess = (userData) => {
  console.log('Пользователь успешно вошел:', userData)
  setTimeout(() => {
    alert(`Добро пожаловать, ${userData.full_name || 'пользователь'}!`)
  }, 300)
}

// Функция для плавной прокрутки
const smoothScroll = (elementId) => {
  const element = document.getElementById(elementId)
  if (element) {
    const headerHeight = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// Предоставляем функцию прокрутки
provide('smoothScroll', smoothScroll)

// Для быстрого теста - временно откройте модалку при загрузке
// setTimeout(() => {
//   showLoginModal.value = true
//   document.body.style.overflow = 'hidden'
// }, 1000)
</script>

<style>
.home-page {
  min-height: 100vh;
}
</style>