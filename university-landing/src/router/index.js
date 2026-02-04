import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/Dashboard.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '', // /dashboard
          name: 'dashboard-home',
          component: () => import('../views/dashboard/Home.vue')
        },
        {
          path: 'profile', // /dashboard/profile
          name: 'profile',
          component: () => import('../views/dashboard/ProfilePage.vue')
        },
        {
          path: 'events', // /dashboard/events
          name: 'events',
          component: () => import('../views/dashboard/EventsPage.vue')
        },
        {
          path: 'my-events', // /dashboard/my-events
          name: 'my-events',
          component: () => import('../views/dashboard/MyEventsPage.vue')
        },
        {
          path: 'qr', // /dashboard/qr
          name: 'qr',
          component: () => import('../views/dashboard/QRCodePage.vue')
        },
        {
          path: 'points', // /dashboard/points
          name: 'points',
          component: () => import('../views/dashboard/PointsPage.vue')
        },
        {
          path: 'feedback', // /dashboard/feedback
          name: 'feedback',
          component: () => import('../views/dashboard/FeedbackPage.vue')
        }
      ]
    },
    {
      path: '/specialist',
      name: 'specialist',
      component: () => import('../views/specialist/SpecialistView.vue'),
      meta: { requiresAuth: true, requiresSpecialist: true },
      children: [
        {
          path: '', // /specialist
          name: 'specialist-home',
          component: () => import('../components/specialist/Dashboard.vue')
        },
        {
          path: 'dashboard', // /specialist/dashboard
          redirect: { name: 'specialist-home' }
        },
        {
          path: 'events', // /specialist/events
          name: 'specialist-events',
          component: () => import('../components/specialist/EventsManagement.vue')
        },
        {
          path: 'feedback', // /specialist/feedback
          name: 'specialist-feedback',
          component: () => import('../components/specialist/FeedbackSection.vue')
        },
        {
          path: 'analytics', // /specialist/analytics
          name: 'specialist-analytics',
          component: () => import('../components/specialist/AnalyticsDashboard.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token')
    const userEmail = localStorage.getItem('user_email')
    
    if (!token) {
      next({ path: '/' })
      return
    }
    
    if (to.matched.some(record => record.meta.requiresSpecialist)) {
      if (userEmail !== 'elisonkein@yahoo.com') {
        alert('Доступ разрешен только для специалистов УГНТУ')
        next({ path: '/dashboard' })
        return
      }
    }
    
    if (to.path.startsWith('/specialist') && userEmail !== 'elisonkein@yahoo.com') {
      alert('Доступ разрешен только для специалистов УГНТУ')
      next({ path: '/dashboard' })
      return
    }
    
    if (to.path.startsWith('/dashboard') && userEmail === 'elisonkein@yahoo.com') {
      alert('Специалист не может использовать ЛК абитуриента')
      next({ path: '/specialist' })
      return
    }
    
    next()
  } else {
    next()
  }
})

export default router