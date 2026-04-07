<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Menu, X, Zap, Gamepad2, Trophy, Star, ShoppingBag, Bell, Home } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import ThemeToggle from '@/components/ThemeToggle.vue'

interface NavLink {
  label: string
  labelEn: string
  href: string
  icon: unknown
}

const navLinks: NavLink[] = [
  { label: 'ゲーム',    labelEn: 'Games',    href: '#games',    icon: Gamepad2 },
  { label: 'ランキング', labelEn: 'Rankings', href: '#rankings', icon: Trophy },
  { label: '注目作',    labelEn: 'Featured', href: '#featured', icon: Star },
  { label: 'ショップ',  labelEn: 'Shop',     href: '#shop',     icon: ShoppingBag },
]

const scrolled    = ref(false)
const hidden      = ref(false)
const open        = ref(false)
const activeHref  = ref<string | null>(null)
const notifPulse  = ref(true)
// Which bottom nav item is "active" — tracked by scroll position
const activeSection = ref<string>('#games')

let prevScrollY = 0

function handleScroll() {
  const y = window.scrollY
  scrolled.value = y > 20
  hidden.value   = y > prevScrollY && y > 80 && !open.value
  prevScrollY    = y

  // Update active bottom nav by visible section
  const ids = ['games', 'rankings', 'featured']
  for (const id of [...ids].reverse()) {
    const el = document.getElementById(id)
    if (el && y + 120 >= el.offsetTop) {
      activeSection.value = `#${id}`
      break
    }
  }
}

function closeMenu() { open.value = false }

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
      hidden  ? '-translate-y-full' : 'translate-y-0',
    )"
  >
    <!-- Neon top line -->
    <div class="h-[2px] w-full bg-linear-to-r from-neon-purple via-neon-mint to-neon-purple animate-neon-pulse" aria-hidden="true" />

    <nav
      aria-label="Primary navigation"
      class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4"
    >
      <!-- Logo -->
      <a href="#" aria-label="NekoVerse home" class="flex items-center gap-2.5 group shrink-0 touch-press">
        <div class="relative w-8 h-8">
          <div class="absolute inset-0 rounded-lg bg-neon-purple/30 group-hover:bg-neon-purple/50 transition-colors duration-300 glow-purple" />
          <Zap class="absolute inset-0 m-auto w-5 h-5 text-neon-mint group-hover:text-foreground transition-colors duration-300" aria-hidden="true" />
        </div>
        <span class="font-display text-lg font-black tracking-widest text-foreground group-hover:text-neon-mint transition-colors duration-300 text-glow-mint">
          NEKO<span class="text-neon-purple text-glow-purple">VERSE</span>
        </span>
        <span class="hidden sm:inline text-[10px] font-mono text-muted-foreground tracking-widest border border-border rounded px-1 py-0.5 ml-1">JP</span>
      </a>

      <!-- Desktop nav links -->
      <ul class="hidden md:flex items-center gap-1" role="list">
        <li v-for="link in navLinks" :key="link.href">
          <a
            :href="link.href"
            :class="cn(
              'relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group',
              activeHref === link.href
                ? 'text-neon-mint bg-neon-mint/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-2',
            )"
            @mouseenter="activeHref = link.href"
            @mouseleave="activeHref = null"
          >
            <component
              :is="link.icon"
              :class="cn(
                'w-4 h-4 transition-all duration-300',
                activeHref === link.href ? 'text-neon-mint scale-110' : 'text-muted-foreground group-hover:text-neon-purple',
              )"
              aria-hidden="true"
            />
            <span class="font-body">{{ link.label }}</span>
            <span
              :class="cn(
                'absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full bg-neon-mint transition-all duration-300 origin-left',
                activeHref === link.href ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0',
              )"
              aria-hidden="true"
            />
          </a>
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
        <a
          href="#play"
          :class="cn(
            'hidden sm:flex items-center gap-2 px-5 py-2 rounded-xl font-display font-bold text-sm tracking-wider',
            'bg-neon-purple text-primary-foreground',
            'hover:bg-neon-purple/80 transition-all duration-300',
            'glow-purple hover:scale-105 active:scale-95',
            'clip-corner-sm touch-press',
          )"
        >
          <Zap class="w-4 h-4" aria-hidden="true" />
          プレイ
        </a>

        <!-- Mobile hamburger — sheet toggle -->
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

    <!-- Desktop collapsible sub-menu strip (unchanged) -->
    <div
      id="desktop-menu"
      class="hidden md:block overflow-hidden transition-all duration-400 ease-in-out"
    />
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
          <span class="font-display font-bold text-sm text-foreground tracking-wider">メニュー / MENU</span>
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
          <li v-for="link in navLinks" :key="link.href">
            <a
              :href="link.href"
              :class="cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-body transition-all duration-200 touch-press',
                activeSection === link.href
                  ? 'text-neon-mint bg-neon-mint/10 border border-neon-mint/20'
                  : 'text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/10',
              )"
              @click="closeMenu"
            >
              <component :is="link.icon" class="w-5 h-5 text-neon-purple shrink-0" aria-hidden="true" />
              <span class="font-medium">{{ link.label }}</span>
              <span class="ml-auto text-xs text-muted-foreground/50 font-mono">{{ link.labelEn }}</span>
              <span
                v-if="activeSection === link.href"
                class="w-1.5 h-1.5 rounded-full bg-neon-mint animate-neon-pulse shrink-0"
                aria-hidden="true"
              />
            </a>
          </li>
        </ul>

        <!-- CTA inside sheet -->
        <div class="px-4 pb-4">
          <a
            href="#play"
            :class="cn(
              'flex items-center justify-center gap-2 w-full px-5 py-4 rounded-2xl',
              'font-display font-bold text-base tracking-wider',
              'bg-neon-purple text-primary-foreground glow-purple touch-press',
            )"
            @click="closeMenu"
          >
            <Zap class="w-5 h-5" aria-hidden="true" />
            今すぐプレイ — Play Now
          </a>
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
    <a
      href="#"
      :class="cn(
        'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-body transition-all duration-200 touch-press',
        activeSection === '#' ? 'text-neon-purple' : 'text-muted-foreground',
      )"
      aria-label="Home"
      @click="activeSection = '#'"
    >
      <Home class="w-5 h-5 mb-0.5" aria-hidden="true" />
      <span>ホーム</span>
    </a>

    <a
      v-for="link in navLinks.slice(0, 3)"
      :key="link.href"
      :href="link.href"
      :class="cn(
        'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-body transition-all duration-200 touch-press relative',
        activeSection === link.href ? 'text-neon-purple' : 'text-muted-foreground',
      )"
      :aria-label="link.labelEn"
      :aria-current="activeSection === link.href ? 'page' : undefined"
    >
      <!-- Active pip -->
      <span
        v-if="activeSection === link.href"
        class="absolute top-1 w-1 h-1 rounded-full bg-neon-purple animate-neon-pulse"
        aria-hidden="true"
      />
      <component :is="link.icon" class="w-5 h-5 mb-0.5" aria-hidden="true" />
      <span>{{ link.label }}</span>
    </a>

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
      <span>メニュー</span>
    </button>
  </nav>
</template>
