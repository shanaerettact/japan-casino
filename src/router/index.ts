import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import CategoryPage from '@/pages/CategoryPage.vue'
import PromotionsPage from '@/pages/PromotionsPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/category/:slug',
    name: 'category',
    component: CategoryPage,
    props: true,
  },
  {
    path: '/promotions',
    name: 'promotions',
    component: PromotionsPage,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})
