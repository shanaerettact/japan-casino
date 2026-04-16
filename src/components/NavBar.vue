<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Menu, X, Zap, Tv2, MessageCircle, Trophy, Fish, Layers, Bell, Home } from 'lucide-vue-next'

import { cn } from '@/lib/utils'
import ThemeToggle from '@/components/ThemeToggle.vue'

interface NavLink {
  label: string
  slug: string
  to: string | null   // null = action only, no navigation
  icon: unknown
}

const navLinks: NavLink[] = [
  { label: 'All Games',        slug: 'all',        to: '/category/all',        icon: Zap },
  { label: '優惠',              slug: 'promotions', to: '/promotions',          icon: Tv2 },
  { label: 'サポート', slug: 'support',    to: null,                   icon: MessageCircle },
  { label: 'Sports',           slug: 'sports',     to: '/category/sports',     icon: Trophy },
  { label: 'Fishing',          slug: 'fishing',    to: '/category/fishing',    icon: Fish },
  { label: 'Cards',            slug: 'cards',      to: '/category/cards',      icon: Layers },
]

const route = useRoute()

const scrolled   = ref(false)
const open       = ref(false)
const notifPulse = ref(true)

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

function closeMenu() { open.value = false }

// Is any category currently active?
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
  <!-- Top navigation bar -->
  <header
    role="banner"
    :class="cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border' : 'bg-transparent',
    )"
  >
    <!-- Neon top line -->
    <div class="h-[2px] w-full bg-linear-to-r from-neon-purple via-neon-mint to-neon-purple animate-neon-pulse" aria-hidden="true" />

    <nav
      aria-label="Primary navigation"
      class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4"
    >
      <!-- Logo -->
      <RouterLink to="/" aria-label="NekoVerse home" class="flex items-center gap-2.5 group shrink-0 touch-press">
        <div class="relative w-8 h-8">
          <div class="absolute inset-0 rounded-lg bg-neon-purple/30 group-hover:bg-neon-purple/50 transition-colors duration-300 glow-purple" />
          <Zap class="absolute inset-0 m-auto w-5 h-5 text-neon-mint group-hover:text-foreground transition-colors duration-300" aria-hidden="true" />
        </div>
        <span class="font-display text-lg font-black tracking-widest text-foreground group-hover:text-neon-mint transition-colors duration-300 text-glow-mint">
          NEKO<span class="text-neon-purple text-glow-purple">VERSE</span>
        </span>
        <span class="hidden sm:inline text-[10px] font-mono text-muted-foreground tracking-widest border border-border rounded px-1 py-0.5 ml-1">JP</span>
      </RouterLink>

      <!-- Desktop nav links -->
      <ul class="hidden md:flex items-center gap-1" role="list">
        <li v-for="link in navLinks" :key="link.slug">
          <!-- Action-only item (no navigation) -->
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

          <!-- Regular navigable link -->
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
            <!-- Active underline -->
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

      <!-- Right-side actions -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Notification bell -->
        <button
          type="button"
          aria-label="Notifications — 3 unread"
          class="relative p-2 rounded-xl text-muted-foreground hover:text-neon-purple hover:bg-neon-purple/10 transition-all duration-300 touch-press touch-target"
        >
          <Bell class="w-5 h-5" aria-hidden="true" />
          <span
            v-if="notifPulse"
            class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-mint animate-neon-pulse"
            aria-hidden="true"
          />
        </button>

        <!-- Theme toggle -->
        <ThemeToggle />

        <!-- CTA — desktop only -->
        <RouterLink
          to="/category/all"
          :class="cn(
            'hidden sm:flex items-center gap-2 px-5 py-2 rounded-xl font-display font-bold text-sm tracking-wider',
            'bg-neon-purple text-primary-foreground',
            'hover:bg-neon-purple/80 transition-all duration-300',
            'glow-purple hover:scale-105 active:scale-95',
            'clip-corner-sm touch-press',
          )"
        >
          <Zap class="w-4 h-4" aria-hidden="true" />
          Play Now
        </RouterLink>

        <!-- Mobile hamburger -->
        <button
          type="button"
          :aria-label="open ? 'Close menu' : 'Open menu'"
          :aria-expanded="open"
          aria-controls="mobile-sheet"
          class="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors duration-200 touch-press touch-target"
          @click="open = !open"
        >
          <X v-if="open" class="w-5 h-5" aria-hidden="true" />
          <Menu v-else  class="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  </header>

  <!-- Mobile full-screen sheet overlay -->
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade-overlay">
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden animate-fade-in"
        aria-hidden="true"
        @click="closeMenu"
      />
    </Transition>

    <!-- Bottom sheet -->
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
        <!-- Sheet handle -->
        <div class="flex justify-center pt-3 pb-1" aria-hidden="true">
          <div class="w-10 h-1 rounded-full bg-border" />
        </div>

        <!-- Sheet header -->
        <div class="flex items-center justify-between px-5 py-3 border-b border-border">
          <span class="font-display font-bold text-sm text-foreground tracking-wider">MENU</span>
          <button
            type="button"
            aria-label="Close menu"
            class="p-1.5 rounded-xl text-muted-foreground hover:text-foreground touch-press"
            @click="closeMenu"
          >
            <X class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <!-- Nav links -->
        <ul class="px-4 pt-3 pb-2 flex flex-col gap-1" role="list">
          <li v-for="link in navLinks" :key="link.slug">
            <!-- Action-only item (no navigation) -->
            <button
              v-if="link.to === null"
              type="button"
              class="flex w-full items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-body text-muted-foreground transition-all duration-200 touch-press cursor-default"
            >
              <component :is="link.icon" class="w-5 h-5 text-neon-purple shrink-0" aria-hidden="true" />
              <span class="font-medium">{{ link.label }}</span>
            </button>

            <!-- Regular navigable link -->
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

        <!-- CTA inside sheet -->
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

  <!-- Mobile bottom navigation bar -->
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
    <!-- Home -->
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

    <!-- First 3 category links -->
    <template v-for="link in navLinks.slice(0, 3)" :key="link.slug">
      <!-- Action-only item (no navigation) -->
      <button
        v-if="link.to === null"
        type="button"
        :aria-label="link.label"
        class="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-body text-muted-foreground transition-all duration-200 touch-press cursor-default"
      >
        <component :is="link.icon" class="w-5 h-5 mb-0.5" aria-hidden="true" />
        <span>{{ link.label }}</span>
      </button>

      <!-- Regular navigable link -->
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

    <!-- Menu button -->
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
      <span>Menu</span>
    </button>
  </nav>
</template>
