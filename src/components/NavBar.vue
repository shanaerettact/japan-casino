<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Menu, X, Zap, Tv2, MessageCircle, Trophy, Fish, Layers, Bell, Home, Wallet, Coins, RefreshCw, User } from 'lucide-vue-next'

import { cn } from '@/lib/utils'
import ThemeToggle from '@/components/ThemeToggle.vue'

// Mock user state
const user = ref({
  nickname: 'ネコ太郎',
  avatarInitial: 'ネ',
  walletBalance: '¥12,500',
  walletPoints: '3,280',
})
const pointsLoading = ref(false)

function refreshPoints() {
  if (pointsLoading.value) return
  pointsLoading.value = true
  setTimeout(() => {
    pointsLoading.value = false
  }, 1800)
}

interface NavLink {
  label: string
  slug: string
  to: string | null
  icon: unknown
}

const navLinks: NavLink[] = [
  { label: '全ゲーム', slug: 'all',        to: '/category/all',        icon: Zap },
  { label: 'キャンペーン', slug: 'promotions', to: '/promotions',          icon: Tv2 },
  { label: 'サポート', slug: 'support',    to: null,                   icon: MessageCircle },
  { label: 'スポーツ', slug: 'sports',     to: '/category/sports',     icon: Trophy },
  { label: '釣り', slug: 'fishing',    to: '/category/fishing',    icon: Fish },
  { label: 'カード', slug: 'cards',      to: '/category/cards',      icon: Layers },
]

const route = useRoute()

const scrolled   = ref(false)
const open       = ref(false)
const notifPulse = ref(true)

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

function closeMenu() { open.value = false }

const isOnHome = computed(() => route.path === '/')
const activeCategorySlug = computed(() => {
  if (route.name === 'promotions') return 'promotions'
  return route.params.slug as string | undefined
})

let notifTimer: ReturnType<typeof setTimeout>

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  notifTimer = setTimeout(() => { notifPulse.value = false }, 4000)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  clearTimeout(notifTimer)
})
</script>

<template>
  
  <header
    role="banner"
    :class="cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border' : 'bg-transparent',
    )"
  >
    
    <div class="h-[2px] w-full bg-linear-to-r from-neon-purple via-neon-mint to-neon-purple animate-neon-pulse" aria-hidden="true" />

    <nav
      aria-label="Primary navigation"
      class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4"
    >

      <!-- ── Logo ─────────────────────────────────────────────── -->
      <RouterLink
        to="/"
        aria-label="NekoVerse home"
        class="flex items-center gap-2 shrink-0 group touch-press"
      >
        <!-- Icon badge -->
        <div class="relative w-7 h-7 shrink-0">
          <div
            class="absolute inset-0 rounded-lg bg-neon-purple/20 border border-neon-purple/40 group-hover:bg-neon-purple/35 group-hover:border-neon-purple/70 transition-all duration-300"
            aria-hidden="true"
          />
          <Zap
            class="absolute inset-0 m-auto w-4 h-4 text-neon-mint group-hover:scale-110 transition-transform duration-300"
            aria-hidden="true"
          />
        </div>
        <!-- Wordmark -->
        <span class="font-display text-[13px] font-black tracking-[0.18em] text-foreground group-hover:text-neon-mint transition-colors duration-300 leading-none">
          NEKO<span class="text-neon-purple">VERSE</span>
        </span>
        <!-- Region badge -->
        <span class="hidden sm:inline-flex items-center font-mono text-[8px] tracking-widest text-muted-foreground border border-border/70 rounded px-1 py-px leading-none">
          JP
        </span>
      </RouterLink>

      <!-- ── Desktop nav links ───────────────────────────────── -->
      <ul class="hidden md:flex items-center gap-0.5" role="list">
        <li v-for="link in navLinks" :key="link.slug">

          <!-- Non-routable item -->
          <button
            v-if="link.to === null"
            type="button"
            :class="cn(
              'relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium',
              'text-muted-foreground hover:text-foreground hover:bg-surface-2/80 cursor-default',
              'transition-all duration-200 group',
            )"
          >
            <component
              :is="link.icon"
              class="w-3.5 h-3.5 text-muted-foreground group-hover:text-neon-purple transition-colors duration-200 shrink-0"
              aria-hidden="true"
            />
            {{ link.label }}
          </button>

          <!-- Routable item -->
          <RouterLink
            v-else
            :to="link.to"
            :class="cn(
              'relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium',
              'transition-all duration-200 group',
              activeCategorySlug === link.slug
                ? 'text-neon-mint bg-neon-mint/10 border border-neon-mint/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-2/80 border border-transparent',
            )"
          >
            <component
              :is="link.icon"
              :class="cn(
                'w-3.5 h-3.5 shrink-0 transition-all duration-200',
                activeCategorySlug === link.slug
                  ? 'text-neon-mint'
                  : 'text-muted-foreground group-hover:text-neon-purple',
              )"
              aria-hidden="true"
            />
            {{ link.label }}
            <!-- Active underline -->
            <span
              v-if="activeCategorySlug === link.slug"
              class="absolute bottom-0 left-3 right-3 h-px rounded-full bg-neon-mint/60"
              aria-hidden="true"
            />
          </RouterLink>
        </li>
      </ul>

      <!-- ── Right cluster ──────────────────────────────────── -->
      <div class="flex items-center gap-2 shrink-0">

        <!-- Wallet chip — desktop only -->
        <div
          class="hidden sm:flex items-center h-8 rounded-lg border border-border/80 bg-surface-1/70 backdrop-blur-md overflow-hidden"
          role="group"
          aria-label="ウォレット情報"
        >
          <!-- Balance segment -->
          <div class="flex items-center gap-1.5 px-2.5 h-full border-r border-border/60">
            <div
              class="w-4 h-4 rounded flex items-center justify-center bg-neon-purple/20 shrink-0"
              aria-hidden="true"
            >
              <Wallet class="w-2.5 h-2.5 text-neon-purple" aria-hidden="true" />
            </div>
            <span class="font-mono text-[11px] font-semibold text-foreground tracking-wide leading-none">
              {{ user.walletBalance }}
            </span>
          </div>

          <!-- Points segment -->
          <div class="flex items-center gap-1.5 pl-2.5 pr-1.5 h-full">
            <div
              class="w-4 h-4 rounded flex items-center justify-center bg-neon-mint/15 shrink-0"
              aria-hidden="true"
            >
              <Coins class="w-2.5 h-2.5 text-neon-mint" aria-hidden="true" />
            </div>
            <span class="font-mono text-[11px] font-semibold text-neon-mint tracking-wide leading-none">
              {{ user.walletPoints }}<span class="text-muted-foreground font-normal text-[10px] ml-0.5">pt</span>
            </span>
            <!-- Refresh button -->
            <button
              type="button"
              aria-label="ポイントを更新"
              class="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/10 transition-all duration-200 touch-press ml-0.5"
              @click="refreshPoints"
            >
              <RefreshCw
                :class="cn(
                  'w-2.5 h-2.5 transition-colors duration-200',
                  pointsLoading ? 'animate-spin text-neon-mint' : 'text-muted-foreground',
                )"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <!-- Play Now CTA -->
        <RouterLink
          to="/category/all"
          :class="cn(
            'hidden md:flex items-center gap-1.5 h-8 px-4 font-display font-bold text-[11px] tracking-widest',
            'bg-neon-purple text-primary-foreground rounded-lg',
            'hover:bg-neon-purple/85 active:scale-95 transition-all duration-200',
            'clip-corner-sm touch-press',
          )"
        >
          <Zap class="w-3 h-3 shrink-0" aria-hidden="true" />
          PLAY
        </RouterLink>

        <!-- User pill -->
        <button
          type="button"
          aria-label="ユーザーメニューを開く"
          class="flex items-center gap-2 h-8 pl-1 pr-2.5 rounded-lg border border-border/80 bg-surface-1/70 backdrop-blur-md hover:border-neon-purple/45 hover:bg-surface-2/80 transition-all duration-250 group touch-press"
        >
          <!-- Avatar -->
          <div class="relative w-6 h-6 rounded-md shrink-0 overflow-visible">
            <div
              class="w-6 h-6 rounded-md bg-gradient-to-br from-neon-purple to-neon-mint/70 flex items-center justify-center group-hover:shadow-[0_0_10px_oklch(0.62_0.28_305/0.55)] transition-shadow duration-300"
              aria-hidden="true"
            >
              <span class="font-display text-[9px] font-black text-white leading-none select-none">
                {{ user.avatarInitial }}
              </span>
            </div>
            <!-- Online indicator -->
            <span
              class="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-neon-mint border-[1.5px] border-background animate-neon-pulse shrink-0"
              aria-label="オンライン"
            />
          </div>

          <!-- Nickname -->
          <div class="hidden lg:flex flex-col items-start leading-none gap-px">
            <span class="font-body text-[11px] font-semibold text-foreground group-hover:text-neon-mint transition-colors duration-200 max-w-[72px] truncate leading-none">
              {{ user.nickname }}
            </span>
            <span class="font-mono text-[9px] text-neon-mint/70 tracking-wider leading-none">ONLINE</span>
          </div>
        </button>

      </div>
    </nav>
  </header>

  
  <Teleport to="body">
    
    <Transition name="fade-overlay">
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden animate-fade-in"
        aria-hidden="true"
        @click="closeMenu"
      />
    </Transition>

    
    <Transition name="slide-sheet">
      <nav
        v-if="open"
        id="mobile-sheet"
        role="navigation"
        aria-label="Mobile navigation"
        :class="cn(
          'fixed bottom-0 left-0 right-0 z-50 md:hidden',
          'glass-card rounded-t-3xl border-t border-neon-purple/30',
          'pb-safe animate-slide-up',
        )"
      >
        
        <div class="flex justify-center pt-3 pb-1" aria-hidden="true">
          <div class="w-10 h-1 rounded-full bg-border" />
        </div>

        
        <div
          class="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 border-b border-neon-purple/15 bg-linear-to-r from-neon-purple/[0.06] via-transparent to-neon-mint/[0.06]"
        >
          <span
            class="font-display font-bold text-sm text-foreground tracking-[0.2em] shrink-0 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/80"
          >
            MENU
          </span>
          <div class="flex-1 min-w-2" aria-hidden="true" />
          <div
            class="flex items-center gap-0.5 rounded-2xl border border-border/90 bg-background/75 backdrop-blur-md p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_4px_24px_-8px_rgba(139,92,246,0.35)]"
          >
            <span class="w-px h-7 self-center rounded-full bg-border/70 shrink-0" aria-hidden="true" />
            <div class="flex items-center justify-center px-1 shrink-0">
              <ThemeToggle />
            </div>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            class="p-2 rounded-xl text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/10 border border-transparent hover:border-neon-mint/25 transition-all duration-300 touch-press shrink-0"
            @click="closeMenu"
          >
            <X class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        
        <ul class="px-4 pt-3 pb-2 flex flex-col gap-1" role="list">
          <li v-for="link in navLinks" :key="link.slug">
            
            <button
              v-if="link.to === null"
              type="button"
              class="flex w-full items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-body text-muted-foreground transition-all duration-200 touch-press cursor-default"
            >
              <component :is="link.icon" class="w-5 h-5 text-neon-purple shrink-0" aria-hidden="true" />
              <span class="font-medium">{{ link.label }}</span>
            </button>

            
            <RouterLink
              v-else
              :to="link.to"
              :class="cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-body transition-all duration-200 touch-press',
                activeCategorySlug === link.slug
                  ? 'text-neon-mint bg-neon-mint/10 border border-neon-mint/20'
                  : 'text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/10',
              )"
              @click="closeMenu"
            >
              <component :is="link.icon" class="w-5 h-5 text-neon-purple shrink-0" aria-hidden="true" />
              <span class="font-medium">{{ link.label }}</span>
              <span
                v-if="activeCategorySlug === link.slug"
                class="ml-auto w-1.5 h-1.5 rounded-full bg-neon-mint animate-neon-pulse shrink-0"
                aria-hidden="true"
              />
            </RouterLink>
          </li>
        </ul>

        
        <div class="px-4 pb-4">
          <RouterLink
            to="/category/all"
            :class="cn(
              'flex items-center justify-center gap-2 w-full px-5 py-4 rounded-2xl',
              'font-display font-bold text-base tracking-wider',
              'bg-neon-purple text-primary-foreground glow-purple touch-press',
            )"
            @click="closeMenu"
          >
            <Zap class="w-5 h-5" aria-hidden="true" />
            Play Now
          </RouterLink>
        </div>
      </nav>
    </Transition>
  </Teleport>

  
  <nav
    aria-label="Mobile bottom navigation"
    :class="cn(
      'fixed bottom-0 left-0 right-0 z-40 md:hidden',
      'glass-card border-t border-border',
      'flex items-stretch h-16',
      'transition-transform duration-300',
      open ? 'translate-y-full' : 'translate-y-0',
    )"
    style="padding-bottom: env(safe-area-inset-bottom, 0px);"
  >
    
    <RouterLink
      to="/"
      :class="cn(
        'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-body transition-all duration-200 touch-press',
        isOnHome ? 'text-neon-purple' : 'text-muted-foreground',
      )"
      aria-label="Home"
    >
      <Home class="w-5 h-5 mb-0.5" aria-hidden="true" />
      <span>Home</span>
    </RouterLink>

    
    <template v-for="link in navLinks.slice(0, 3)" :key="link.slug">
      
      <button
        v-if="link.to === null"
        type="button"
        :aria-label="link.label"
        class="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-body text-muted-foreground transition-all duration-200 touch-press cursor-default"
      >
        <component :is="link.icon" class="w-5 h-5 mb-0.5" aria-hidden="true" />
        <span>{{ link.label }}</span>
      </button>

      
      <RouterLink
        v-else
        :to="link.to"
        :class="cn(
          'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-body transition-all duration-200 touch-press relative',
          activeCategorySlug === link.slug ? 'text-neon-purple' : 'text-muted-foreground',
        )"
        :aria-label="link.label"
        :aria-current="activeCategorySlug === link.slug ? 'page' : undefined"
      >
        <span
          v-if="activeCategorySlug === link.slug"
          class="absolute top-1 w-1 h-1 rounded-full bg-neon-purple animate-neon-pulse"
          aria-hidden="true"
        />
        <component :is="link.icon" class="w-5 h-5 mb-0.5" aria-hidden="true" />
        <span>{{ link.label }}</span>
      </RouterLink>
    </template>

    
    <button
      type="button"
      aria-label="Open menu"
      :aria-expanded="open"
      :class="cn(
        'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-body transition-all duration-200 touch-press',
        open ? 'text-neon-mint' : 'text-muted-foreground',
      )"
      @click="open = !open"
    >
      <Menu class="w-5 h-5 mb-0.5" aria-hidden="true" />
      <span>メニュー</span>
    </button>
  </nav>
</template>
