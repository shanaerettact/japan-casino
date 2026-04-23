<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  Menu,
  X,
  Zap,
  Home,
  Wallet,
  Coins,
  RefreshCw,
  ArrowDownToLine,
  ArrowUpFromLine,
  Crown,
  Landmark,
  Receipt,
  History,
  User,
  Tv2,
  MessageCircle,
} from 'lucide-vue-next'

import { cn } from '@/lib/utils'
import ThemeToggle from '@/components/ThemeToggle.vue'
import RegisterModal from '@/components/RegisterModal.vue'

const registerOpen = ref(false)

// Mock user — replace with store / auth
const user = ref({
  nickname: 'ネコ侍',
  avatarInitial: 'ネ',
  points: 48_250,
})

const pointsRefreshing = ref(false)

function formatPoints(n: number) {
  return n.toLocaleString('ja-JP')
}

function refreshPoints() {
  if (pointsRefreshing.value) return
  pointsRefreshing.value = true
  setTimeout(() => {
    user.value.points = Math.floor(Math.random() * 80_000) + 10_000
    pointsRefreshing.value = false
  }, 900)
}

interface NavLink {
  label: string
  slug: string
  to: string | null
  icon: unknown
}

const navLinks: NavLink[] = [
  { label: 'チャージ', slug: 'deposit', to: '/account/charge', icon: ArrowDownToLine },
  { label: '出金', slug: 'withdraw', to: '/account/withdraw', icon: ArrowUpFromLine },
  { label: 'VIPクラブ', slug: 'vip', to: '/vip', icon: Crown },
  { label: '銀行口座', slug: 'bank', to: '/account/bank', icon: Landmark },
  { label: '取引明細', slug: 'billing', to: '/account/billing', icon: Receipt },
  { label: 'ゲーム履歴', slug: 'game-history', to: '/account/game-history', icon: History },
  { label: 'マイページ', slug: 'profile', to: '/account', icon: User },
]

/** 底部 Tab：維持原先「全ゲーム・キャンペーン・サポート」三鍵（與 sheet / 頂欄 navLinks 分離） */
const bottomTabLinks: NavLink[] = [
  { label: '全ゲーム', slug: 'all', to: '/category/all', icon: Zap },
  { label: 'キャンペーン', slug: 'promotions', to: '/promotions', icon: Tv2 },
  { label: 'サポート', slug: 'support', to: null, icon: MessageCircle },
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
  const acc = navLinks.find(l => l.to !== null && route.path === l.to)?.slug
  if (acc) return acc
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
      class="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 min-w-0"
    >
      <RouterLink
        to="/"
        aria-label="NekoVerse home"
        class="flex items-center gap-1 sm:gap-1.5 group shrink-0 touch-press min-w-0"
      >
        <div class="relative size-6 shrink-0 rounded-md">
          <div class="absolute inset-0 rounded-md bg-neon-purple/30 group-hover:bg-neon-purple/50 transition-colors duration-300 glow-purple" />
          <Zap class="absolute inset-0 m-auto size-3.5 text-neon-mint group-hover:text-foreground transition-colors duration-300" aria-hidden="true" />
        </div>
        <span class="font-display flex flex-col items-start justify-center gap-px leading-none text-[11px] sm:text-xs md:text-sm font-black">
          <span class="tracking-[0.06em] sm:tracking-[0.1em] md:tracking-[0.18em] text-foreground group-hover:text-neon-mint transition-colors duration-300 text-glow-mint">
            NEKO
          </span>
          <span class="tracking-[0.06em] sm:tracking-[0.1em] md:tracking-[0.18em] text-neon-purple text-glow-purple">
            VERSE
          </span>
        </span>
        <span class="hidden lg:inline-flex items-center text-[8px] font-mono text-muted-foreground tracking-widest border border-border/80 rounded px-1 py-px leading-none ml-0.5 shrink-0">JP</span>
      </RouterLink>

      
      <ul class="hidden md:flex items-center gap-1" role="list">
        <li v-for="link in navLinks" :key="link.slug">
          
          <button
            v-if="link.to === null"
            type="button"
            :class="cn(
              'relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group',
              'text-muted-foreground hover:text-foreground hover:bg-surface-2 cursor-default',
            )"
          >
            <component
              :is="link.icon"
              class="w-4 h-4 transition-all duration-300 text-muted-foreground group-hover:text-neon-purple"
              aria-hidden="true"
            />
            <span class="font-body">{{ link.label }}</span>
          </button>

          
          <RouterLink
            v-else
            :to="link.to"
            :class="cn(
              'relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group',
              activeCategorySlug === link.slug
                ? 'text-neon-mint bg-neon-mint/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-2',
            )"
          >
            <component
              :is="link.icon"
              :class="cn(
                'w-4 h-4 transition-all duration-300',
                activeCategorySlug === link.slug ? 'text-neon-mint scale-110' : 'text-muted-foreground group-hover:text-neon-purple',
              )"
              aria-hidden="true"
            />
            <span class="font-body">{{ link.label }}</span>
            
            <span
              :class="cn(
                'absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full bg-neon-mint transition-all duration-300 origin-left',
                activeCategorySlug === link.slug ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0',
              )"
              aria-hidden="true"
            />
          </RouterLink>
        </li>
      </ul>

      <div class="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
        <!-- Wallet + points（全寬度顯示；極窄螢幕精簡） -->
        <div
          class="flex items-center h-8 sm:h-9 rounded-lg sm:rounded-xl border border-border/80 bg-surface-2/65 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(139,92,246,0.06)] overflow-hidden ring-1 ring-neon-purple/10 max-w-[min(100%,11rem)] sm:max-w-none"
          role="group"
          aria-label="ウォレット・ポイント"
        >
          <div class="flex items-center gap-1 sm:gap-2 pl-1.5 pr-1 sm:pl-2.5 sm:pr-2 h-full min-w-0 border-r border-border/60 bg-linear-to-r from-neon-purple/[0.07] to-transparent">
            <div
              class="hidden min-[360px]:flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-md sm:rounded-lg bg-neon-purple/20 ring-1 ring-neon-purple/25"
              aria-hidden="true"
            >
              <Wallet class="size-3 sm:size-3.5 text-neon-purple" aria-hidden="true" />
            </div>
            <div class="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <Coins class="size-3 sm:size-3.5 shrink-0 text-yellow-400/95 drop-shadow-[0_0_6px_rgba(250,204,21,0.35)]" aria-hidden="true" />
              <span class="font-display text-[11px] sm:text-xs font-bold tabular-nums tracking-wide text-foreground truncate">
                {{ formatPoints(user.points) }}
              </span>
              <span class="text-[9px] sm:text-[10px] font-mono text-muted-foreground/90 font-medium shrink-0 max-[340px]:hidden">pt</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="ポイントを更新"
            :class="cn(
              'h-full px-2 sm:px-2.5 flex items-center justify-center text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/10 transition-all duration-300 touch-press border-l border-transparent hover:border-neon-mint/15 shrink-0',
              pointsRefreshing ? 'pointer-events-none text-neon-mint' : '',
            )"
            @click="refreshPoints"
          >
            <RefreshCw
              :class="cn(
                'size-3 sm:size-3.5 transition-transform duration-500',
                pointsRefreshing ? 'animate-spin' : 'hover:rotate-180',
              )"
              aria-hidden="true"
            />
          </button>
        </div>

        <!-- User nickname -->
        <button
          type="button"
          class="flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 pl-0.5 sm:pl-1 pr-2 sm:pr-3 rounded-lg sm:rounded-xl border border-border/80 bg-surface-2/65 backdrop-blur-md ring-1 ring-neon-purple/10 hover:border-neon-purple/45 hover:ring-neon-purple/25 hover:bg-surface-2/85 transition-all duration-300 group touch-press min-w-0 max-w-[7.5rem] sm:max-w-[140px] lg:max-w-[200px]"
          :aria-label="user.nickname + ' のプロフィール'"
          @click="registerOpen = true"
        >
          <div class="relative size-6 sm:size-7 shrink-0 rounded-md sm:rounded-lg overflow-hidden ring-1 ring-neon-mint/30 group-hover:ring-neon-mint/55 transition-all duration-300">
            <div
              class="absolute inset-0 bg-linear-to-br from-neon-purple via-neon-purple/80 to-neon-mint/75 opacity-95 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
            <span class="relative flex size-full items-center justify-center font-display text-[9px] sm:text-[10px] font-black text-white leading-none tracking-tight select-none">
              {{ user.avatarInitial }}
            </span>
          </div>
          <span class="font-body text-[11px] sm:text-xs font-semibold text-foreground truncate group-hover:text-neon-mint transition-colors duration-300 tracking-wide min-w-0">
            {{ user.nickname }}
          </span>
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
          'fixed -bottom-10 left-0 right-0 z-50 md:hidden',
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

    
    <template v-for="link in bottomTabLinks" :key="link.slug">
      
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
