<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-about">
          <p class="footer-description">
            Официальный портал для абитуриентов Уфимского государственного 
            нефтяного технического университета. Ваш путь к качественному 
            образованию начинается здесь.
          </p>
        </div>

        

        <div class="footer-contacts">
          <h3 class="contacts-title">Контакты</h3>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon"></span>
              <div class="contact-content">
                <p class="contact-label">Телефон:</p>
                <a href="tel:+78005514528" class="contact-link">8 (800) 55-14-528</a>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon"></span>
              <div class="contact-content">
                <p class="contact-label">E-mail:</p>
                <a href="mailto:pkugntu@mail.ru" class="contact-link">pkugntu@mail.ru</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-divider"></div>

      <div class="footer-bottom">
        <div class="copyright">
          © 2025 Уфимский государственный нефтяной технический университет. Все права защищены.
        </div>
        <div class="legal-links">
          <a href="#" class="legal-link">Политика конфиденциальности</a>
          <a href="#" class="legal-link">Пользовательское соглашение</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #622A97 0%, #4a1f72 100%);
  color: white;
  padding: 15px 0 15px;
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.footer-top {
  grid-template-columns: 2fr 1fr 2fr;
  gap: 60px;
  margin-bottom: 60px;
}

/* Левая колонка */
.footer-about {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.logo-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.logo-text {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
}

.footer-description {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  font-size: 1.05rem;
  margin-bottom: 15px;
}

.social-links {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.social-icon {
  font-size: 1.5rem;
  display: block;
}


.links-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 10px;
  position: relative;
  padding-bottom: 15px;
}

.links-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
}

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.links-list li {
  margin: 0;
}

.footer-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 1.05rem;
  transition: all 0.3s;
  display: inline-block;
  padding: 5px 0;
  position: relative;
}

.footer-link:hover {
  color: white;
  transform: translateX(5px);
}

.footer-link::before {
  content: '→';
  position: absolute;
  left: -20px;
  opacity: 0;
  transition: all 0.3s;
}

.footer-link:hover::before {
  opacity: 1;
  left: -15px;
}

/* Правая колонка */
.footer-contacts {
  flex-direction: column;
  gap: 25px;
}

.contacts-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 10px;
  position: relative;
  padding-bottom: 15px;
}

.contacts-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  border-radius: 2px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.contact-item {
  align-items: flex-start;
  gap: 15px;
}

.contact-icon {
  font-size: 1.3rem;
  margin-top: 5px;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.contact-label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.contact-text {
  font-size: 1.05rem;
  line-height: 1.5;
}

.contact-link {
  color: white;
  text-decoration: none;
  font-size: 1.05rem;
  transition: all 0.3s;
  display: inline-block;
}

.contact-link:hover {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
}

/* Разделитель */
.footer-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: 40px 0;
}

/* Нижняя часть футера */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
  padding-top: 30px;
}

.copyright {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.5;
}

.legal-links {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.legal-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s;
  position: relative;
  padding: 5px 0;
}

.legal-link:hover {
  color: white;
}

.legal-link:not(:last-child)::after {
  position: absolute;
  right: -18px;
  top: 5px;
  color: rgba(255, 255, 255, 0.3);
}

/* Адаптивность */
@media (max-width: 1024px) {
  .footer-top {
    gap: 40px;
    grid-template-columns: 2fr 1fr 1.5fr;
  }
}

@media (max-width: 900px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 50px;
  }
  
  .footer {
    padding: 60px 0 30px;
  }
}

@media (max-width: 768px) {
  .footer-top {
    gap: 40px;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .legal-links {
    justify-content: center;
    gap: 20px;
  }
  
  .legal-link:not(:last-child)::after {
    display: none;
  }
  
  .footer-logo {
    justify-content: center;
  }
  
  .footer-description {
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .links-title,
  .contacts-title {
    text-align: center;
  }
  
  .links-title::after,
  .contacts-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (max-width: 600px) {
  .footer {
    padding: 50px 0 25px;
  }
  
  .logo-text {
    font-size: 1.8rem;
  }
  
  .logo-img {
    width: 40px;
    height: 40px;
  }
  
  .footer-description {
    font-size: 1rem;
  }
  
  .links-list {
    align-items: center;
  }
  
  .contact-item {
    text-align: center;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .legal-links {
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 400px) {
  .logo-text {
    font-size: 1.6rem;
  }
  
  .social-links {
    gap: 15px;
  }
  
  .social-link {
    width: 40px;
    height: 40px;
  }
  
  .social-icon {
    font-size: 1.3rem;
  }
}
</style>