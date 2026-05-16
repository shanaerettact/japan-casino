import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import CategoryPage from '@/pages/CategoryPage.vue'
import PromotionsPage from '@/pages/PromotionsPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import WithdrawPage from '@/pages/WithdrawPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import GameRecordsPage from '@/pages/GameRecordsPage.vue'
import CyberNeoPage from '@/pages/CyberNeoPage.vue'
import HelpGuidePage from '@/pages/HelpGuidePage.vue'

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
  { path: '/help/chat', name: 'help-chat', component: HelpGuidePage },
  { path: '/help/faq', name: 'help-faq', component: HelpGuidePage },
  { path: '/account/withdraw', name: 'nav-withdraw', component: WithdrawPage },
  { path: '/withdraw', name: 'withdraw', component: WithdrawPage },
  { path: '/account/billing', name: 'nav-billing', component: HomePage },
  { path: '/account/game-history', name: 'nav-game-history', component: GameRecordsPage },
  { path: '/settings/language', redirect: '/about/cyber-neo' },
  { path: '/about/privacy', name: 'about-privacy', component: CyberNeoPage },
  { path: '/about/terms', name: 'about-terms', component: CyberNeoPage },
  { path: '/about/responsible-gambling', name: 'about-responsible', component: CyberNeoPage },
  { path: '/about/cyber-neo', name: 'nav-about-cyber-neo', component: CyberNeoPage },
  { path: '/account', name: 'nav-profile', component: ProfilePage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})
