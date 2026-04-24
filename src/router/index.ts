import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import CategoryPage from '@/pages/CategoryPage.vue'
import PromotionsPage from '@/pages/PromotionsPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import DepositPage from '@/pages/DepositPage.vue'
import WithdrawPage from '@/pages/WithdrawPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
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
  { path: '/account/charge', name: 'nav-deposit', component: DepositPage },
  { path: '/deposit', name: 'deposit', component: DepositPage },
  { path: '/account/withdraw', name: 'nav-withdraw', component: WithdrawPage },
  { path: '/withdraw', name: 'withdraw', component: WithdrawPage },
  { path: '/vip', name: 'nav-vip', component: HomePage },
  { path: '/account/bank', name: 'nav-bank', component: HomePage },
  { path: '/account/billing', name: 'nav-billing', component: HomePage },
  { path: '/account/game-history', name: 'nav-game-history', component: HomePage },
  { path: '/account', name: 'nav-profile', component: HomePage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})
