import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/library',
    name: 'library',
    component: () => import('@/views/LibraryPage.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/divination',
    name: 'divination',
    component: () => import('@/views/DivinationPage.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/result/:id',
    name: 'result',
    component: () => import('@/views/ResultPage.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/views/HistoryPage.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/TestPage.vue'),
    meta: { transition: 'fade' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
