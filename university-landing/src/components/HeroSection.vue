<template>
  <section class="hero">
    <div class="container">
      <div class="hero-card">
        <div class="hero-content">
          <h1 class="hero-title">Начни знакомство с вузом здесь!</h1>
          <div class="hero-buttons">
            <button class="btn btn-primary" @click="openRegistrationModal">
              Зарегистрироваться
            </button>
            <button class="btn btn-secondary" @click="scrollToAbout">
              Узнать больше
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <RegistrationModal 
      :isVisible="showRegistrationModal"
      @close="closeRegistrationModal"
      @success="handleRegistrationSuccess"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import RegistrationModal from './RegistrationModal.vue'

const showRegistrationModal = ref(false)

const openRegistrationModal = () => {
  showRegistrationModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeRegistrationModal = () => {
  showRegistrationModal.value = false
  document.body.style.overflow = 'auto'
}

const handleRegistrationSuccess = (userData) => {
  console.log('Пользователь зарегистрирован:', userData)
  alert(`Спасибо за регистрацию, ${userData.firstName}! Проверьте вашу почту ${userData.email}.`)
}

const scrollToAbout = () => {
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    const headerHeight = 80;
    const elementPosition = aboutSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};
</script>

<style scoped>
.hero {
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  background: url('@/assets/photo_2025-12-15_01-38-13.jpg') center/cover no-repeat;
  padding-top: 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.hero-card {
  background: rgba(255, 255, 255, 0.55);
  border-radius: 24px;
  padding: 3rem 4rem;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-content {
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 2.5rem;
  line-height: 1.3;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.btn-primary {
  background: linear-gradient(90deg, #622A97, #CB79DA);
  color: white;
  box-shadow: 0 8px 25px rgba(98, 42, 151, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(98, 42, 151, 0.4);
}

.btn-secondary {
  background: white;
  color: #622A97;
  border: 2px solid #CB79DA;
}

.btn-secondary:hover {
  background: #f8f8f8;
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .hero-card {
    padding: 2rem;
    margin: 0 1rem;
  }
  
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>