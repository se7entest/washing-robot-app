import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import App from '../App.vue'
import Dashboard from '../views/Dashboard.vue'
import News from '../views/News.vue'
import Company from '../views/Company.vue'
import Device from '../views/Device.vue'
import Case from '../views/Case.vue'
import Video from '../views/Video.vue'
import Appointment from '../views/Appointment.vue'
import Cooperate from '../views/Cooperate.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/',
    component: App,
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'news', name: 'News', component: News },
      { path: 'company', name: 'Company', component: Company },
      { path: 'device', name: 'Device', component: Device },
      { path: 'case', name: 'Case', component: Case },
      { path: 'video', name: 'Video', component: Video },
      { path: 'appointment', name: 'Appointment', component: Appointment },
      { path: 'cooperate', name: 'Cooperate', component: Cooperate },
      { path: 'settings', name: 'Settings', component: Settings }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router

// News management page
