<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  Menu,
  X,
  Zap,
  Home,
  Coins,
  RefreshCw,
  ArrowUpFromLine,
  Receipt,
  History,
  User,
  Languages,
  Sparkles,
  BookOpen,
  Tv2,
  MessageCircle,
  Globe,
  Check,
  ChevronDown,
  Headphones,
  CircleHelp,
  Shield,
  FileText,
  HeartHandshake,
} from 'lucide-vue-next'

import { cn } from '@/lib/utils'
import { useI18n } from '@/composables/useI18n'
import { languages } from '@/locales'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LoginModal from '@/components/LoginModal.vue'

const { lang, setLang, t } = useI18n()

const registerOpen = ref(false)
const languageModalOpen = ref(false)

function openLanguageModal() {
  languageModalOpen.value = true
}

function closeLanguageModal() {
  languageModalOpen.value = false
}

const user = ref({
  nickname: 'ネコ侍',
  avatarInitial: 'ネ',
  points: 48_250,
})

const pointsRefreshing = ref(false)

function formatPoints(n: number) {
  const intlLocale: Record<string, string> = { ja: 'ja-JP', 'zh-TW': 'zh-TW', en: 'en-US' }
  return n.toLocaleString(intlLocale[lang.value] ?? 'ja-JP')
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
  openLanguageModal?: boolean
  children?: { label: string; to: string; icon: unknown }[]
}

const navLinks = computed<NavLink[]>(() => [
  { label: t('nav.withdraw'), slug: 'withdraw', to: '/account/withdraw', icon: ArrowUpFromLine },
  { label: t('nav.billing'), slug: 'billing', to: '/account/billing', icon: Receipt },
  { label: t('nav.gameHistory'), slug: 'game-history', to: '/account/game-history', icon: History },
  {
    label: t('nav.help'),
    slug: 'help',
    to: null,
    icon: BookOpen,
    children: [
      { label: t('nav.helpChat'), to: '/help/chat', icon: Headphones },
      { label: t('nav.helpFaq'), to: '/help/faq', icon: CircleHelp },
    ],
  },
  { label: t('nav.language'), slug: 'language', to: null, icon: Languages, openLanguageModal: true },
  {
    label: t('nav.aboutCyberNeo'),
    slug: 'about-cyber-neo',
    to: null,
    icon: Sparkles,
    children: [
      { label: t('nav.aboutCyberNeoLink'), to: '/about/cyber-neo', icon: Sparkles },
      { label: t('nav.privacy'), to: '/about/privacy', icon: Shield },
      { label: t('nav.terms'), to: '/about/terms', icon: FileText },
      { label: t('nav.responsibleGambling'), to: '/about/responsible-gambling', icon: HeartHandshake },
    ],
  },
  { label: t('nav.profile'), slug: 'profile', to: '/account', icon: User },
])

const bottomTabLinks = computed<NavLink[]>(() => [
  { label: t('nav.allGames'), slug: 'all', to: '/category/all', icon: Zap },
  { label: t('nav.campaigns'), slug: 'promotions', to: '/promotions', icon: Tv2 },
  { label: t('nav.support'), slug: 'support', to: null, icon: MessageCircle },
])

const route = useRoute()

const scrolled = ref(false)
const open = ref(false)
const mobileMenuOpenBtnRef = ref<HTMLButtonElement | null>(null)
const notifPulse = ref(true)
const openNavSubmenuSlug = ref<string | null>(null)
const mobileOpenSubmenuSlug = ref<string | null>(null)
const submenuWrapEls = new Map<string, HTMLElement>()

function setSubmenuWrapRef(slug: string, el: Element | null) {
  if (!el) submenuWrapEls.delete(slug)
  else submenuWrapEls.set(slug, el as HTMLElement)
}

function toggleNavSubmenu(slug: string) {
  openNavSubmenuSlug.value = openNavSubmenuSlug.value === slug ? null : slug
}

function closeNavSubmenu() {
  openNavSubmenuSlug.value = null
}

function toggleMobileSubmenu(slug: string) {
  mobileOpenSubmenuSlug.value = mobileOpenSubmenuSlug.value === slug ? null : slug
}

function onDocumentPointerDown(e: MouseEvent) {
  const slug = openNavSubmenuSlug.value
  if (!slug) return
  const el = submenuWrapEls.get(slug)
  if (!el) return
  if (e.target instanceof Node && !el.contains(e.target)) closeNavSubmenu()
}

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

function closeMenu() {
  open.value = false
  nextTick(() => {
    mobileMenuOpenBtnRef.value?.focus({ preventScroll: true })
  })
}

const lockBodyScroll = computed(
  () => open.value || languageModalOpen.value || registerOpen.value,
)

function setDocumentScrollLock(locked: boolean) {
  if (typeof document === 'undefined') return
  if (locked) {
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
  } else {
    document.documentElement.style.overflow = ''
    document.documentElement.style.overscrollBehavior = ''
    document.body.style.overflow = ''
    document.body.style.overscrollBehavior = ''
  }
}

watch(
  lockBodyScroll,
  (locked) => {
    setDocumentScrollLock(locked)
  },
  { flush: 'sync' },
)

const isOnHome = computed(() => route.path === '/')
const activeCategorySlug = computed(() => {
  if (route.path.startsWith('/help')) return 'help'
  if (route.path.startsWith('/about/')) return 'about-cyber-neo'
  const acc = navLinks.value.find(l => l.to !== null && route.path === l.to)?.slug
  if (acc) return acc
  if (route.name === 'promotions') return 'promotions'
  return route.params.slug as string | undefined
})

watch(
  () => route.path,
  () => {
    closeNavSubmenu()
    mobileOpenSubmenuSlug.value = null
  },
)

let notifTimer: ReturnType<typeof setTimeout>

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('mousedown', onDocumentPointerDown)
  notifTimer = setTimeout(() => { notifPulse.value = false }, 4000)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('mousedown', onDocumentPointerDown)
  clearTimeout(notifTimer)
  if (typeof document === 'undefined') return
  document.documentElement.style.overflow = ''
  document.documentElement.style.overscrollBehavior = ''
  document.body.style.overflow = ''
  document.body.style.overscrollBehavior = ''
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
        aria-label="Neo Cyber home"
        class="flex items-center gap-1 sm:gap-1.5 group shrink-0 touch-press min-w-0"
      >
        <img
          src="/logo.png"
          alt="Neo Cyber"
          class="h-7 sm:h-8 w-auto object-contain shrink-0"
        />
        <span class="font-display flex flex-col items-start justify-center gap-px leading-none text-[11px] sm:text-xs md:text-sm font-black">
          <span class="tracking-[0.06em] sm:tracking-[0.1em] md:tracking-[0.18em] text-foreground group-hover:text-neon-mint transition-colors duration-300 text-glow-mint">
            Neo
          </span>
          <span class="tracking-[0.06em] sm:tracking-[0.1em] md:tracking-[0.18em] text-neon-purple text-glow-purple">
            Cyber
          </span>
        </span>
        <span class="hidden lg:inline-flex items-center text-[8px] font-mono text-muted-foreground tracking-widest border border-border/80 rounded px-1 py-px leading-none ml-0.5 shrink-0">JP</span>
      </RouterLink>

      
      <ul class="hidden md:flex items-center gap-1" role="list">
        <li v-for="link in navLinks" :key="link.slug">
          <button
            v-if="link.openLanguageModal"
            type="button"
            :class="cn(
              'relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group',
              'text-muted-foreground hover:text-foreground hover:bg-surface-2',
            )"
            aria-haspopup="dialog"
            :aria-expanded="languageModalOpen"
            @click="openLanguageModal"
          >
            <component
              :is="link.icon"
              class="w-4 h-4 transition-all duration-300 text-muted-foreground group-hover:text-neon-purple"
              aria-hidden="true"
            />
            <span class="font-body">{{ link.label }}</span>
          </button>

          <div
            v-else-if="link.children?.length"
            :ref="(el) => setSubmenuWrapRef(link.slug, el as Element | null)"
            class="relative"
          >
            <button
              type="button"
              :class="cn(
                'relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group w-full min-w-0 border',
                activeCategorySlug === link.slug
                  ? 'text-neon-mint bg-neon-mint/10 border-neon-mint/25'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-surface-2',
              )"
              :aria-expanded="openNavSubmenuSlug === link.slug"
              aria-haspopup="true"
              :aria-label="link.label"
              @click="toggleNavSubmenu(link.slug)"
            >
              <component
                :is="link.icon"
                :class="cn(
                  'w-4 h-4 shrink-0 transition-all duration-300',
                  activeCategorySlug === link.slug ? 'text-neon-mint scale-110' : 'text-muted-foreground group-hover:text-neon-purple',
                )"
                aria-hidden="true"
              />
              <span class="font-body truncate flex-1 min-w-0 text-left">{{ link.label }}</span>
              <ChevronDown
                :class="cn(
                  'w-4 h-4 shrink-0 transition-transform duration-200',
                  openNavSubmenuSlug === link.slug ? 'rotate-180 text-neon-mint' : '',
                )"
                aria-hidden="true"
              />
              <span
                :class="cn(
                  'absolute bottom-1 left-4 right-10 h-[1.5px] rounded-full bg-neon-mint transition-all duration-300 origin-left pointer-events-none',
                  activeCategorySlug === link.slug ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0',
                )"
                aria-hidden="true"
              />
            </button>
            <Transition name="nav-submenu-pop">
              <ul
                v-if="openNavSubmenuSlug === link.slug"
                class="absolute left-0 top-[calc(100%+6px)] min-w-[13.5rem] origin-top py-1 rounded-xl border border-border/70 bg-surface-1/95 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.55)] z-[55] ring-1 ring-neon-purple/10"
                role="menu"
                :aria-label="link.label"
              >
                <li v-for="child in link.children" :key="child.to" role="none">
                  <RouterLink
                    :to="child.to"
                    role="menuitem"
                    class="flex items-center gap-2.5 px-3 py-2.5 text-sm font-body text-foreground hover:bg-neon-mint/10 hover:text-neon-mint transition-colors touch-press"
                    @click="closeNavSubmenu"
                  >
                    <component :is="child.icon" class="w-4 h-4 text-neon-purple shrink-0" aria-hidden="true" />
                    {{ child.label }}
                  </RouterLink>
                </li>
              </ul>
            </Transition>
          </div>

          <button
            v-else-if="link.to === null"
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
        
        <div
          class="flex items-center h-8 sm:h-9 rounded-lg sm:rounded-xl border border-border/80 bg-surface-2/65 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(139,92,246,0.06)] overflow-hidden ring-1 ring-neon-purple/10 max-w-[min(100%,11rem)] sm:max-w-none"
          role="group"
          :aria-label="t('wallet.label')"
        >
          <div class="flex items-center gap-1 sm:gap-1.5 pl-2 sm:pl-2.5 pr-1 sm:pr-2 h-full min-w-0 border-r border-border/60 bg-linear-to-r from-neon-purple/[0.07] to-transparent">
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
            :aria-label="t('wallet.refresh')"
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

        
        <button
          type="button"
          class="flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 pl-0.5 sm:pl-1 pr-2 sm:pr-3 rounded-lg sm:rounded-xl border border-border/80 bg-surface-2/65 backdrop-blur-md ring-1 ring-neon-purple/10 hover:border-neon-purple/45 hover:ring-neon-purple/25 hover:bg-surface-2/85 transition-all duration-300 group touch-press min-w-0 max-w-[7.5rem] sm:max-w-[140px] lg:max-w-[200px]"
          :aria-label="user.nickname + ' · 会員登録を開く'"
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
            :aria-label="t('a11y.closeMenu')"
            class="p-2 rounded-xl text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/10 border border-transparent hover:border-neon-mint/25 transition-all duration-300 touch-press shrink-0"
            @click="closeMenu"
          >
            <X class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        
        <ul class="px-4 pt-3 pb-2 flex flex-col gap-1" role="list">
          <li v-for="link in navLinks" :key="link.slug">
            <button
              v-if="link.openLanguageModal"
              type="button"
              class="flex w-full items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-body text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/10 transition-all duration-200 touch-press"
              aria-haspopup="dialog"
              :aria-expanded="languageModalOpen"
              @click="openLanguageModal(); closeMenu()"
            >
              <component :is="link.icon" class="w-5 h-5 text-neon-purple shrink-0" aria-hidden="true" />
              <span class="font-medium">{{ link.label }}</span>
            </button>

            <div
              v-else-if="link.children?.length"
              class="rounded-2xl border border-border/45 overflow-hidden bg-surface-2/20"
            >
              <button
                type="button"
                :class="cn(
                  'flex w-full items-center gap-3 px-4 py-3.5 text-sm font-body transition-all duration-200 touch-press min-h-[3.25rem] min-w-0 text-left',
                  activeCategorySlug === link.slug
                    ? 'text-neon-mint bg-neon-mint/10'
                    : 'text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/10',
                )"
                :aria-expanded="mobileOpenSubmenuSlug === link.slug"
                :aria-label="link.label"
                @click="toggleMobileSubmenu(link.slug)"
              >
                <component :is="link.icon" class="w-5 h-5 text-neon-purple shrink-0" aria-hidden="true" />
                <span class="font-medium truncate flex-1 min-w-0">{{ link.label }}</span>
                <ChevronDown
                  :class="cn(
                    'w-4 h-4 shrink-0 transition-transform duration-200',
                    mobileOpenSubmenuSlug === link.slug && 'rotate-180',
                  )"
                  aria-hidden="true"
                />
              </button>
              <Transition name="nav-submenu-expand">
                <ul
                  v-if="mobileOpenSubmenuSlug === link.slug"
                  class="border-t border-border/40 py-1 bg-background/30 overflow-hidden"
                  role="list"
                >
                  <li v-for="child in link.children" :key="child.to">
                    <RouterLink
                      :to="child.to"
                      class="flex items-center gap-3 px-4 py-3 pl-7 text-sm font-body text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/10 transition-colors touch-press"
                      @click="closeMenu"
                    >
                      <component :is="child.icon" class="w-4 h-4 text-neon-purple shrink-0 opacity-90" aria-hidden="true" />
                      <span>{{ child.label }}</span>
                    </RouterLink>
                  </li>
                </ul>
              </Transition>
            </div>

            <button
              v-else-if="link.to === null"
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

  <LoginModal :open="registerOpen" @close="registerOpen = false" />

  <Teleport to="body">
    <Transition name="fade-overlay">
      <div
        v-if="languageModalOpen"
        class="fixed inset-0 z-[60] bg-background/75 backdrop-blur-sm"
        aria-hidden="true"
        @click="closeLanguageModal"
      />
    </Transition>
    <Transition name="scale-fade">
      <div
        v-if="languageModalOpen"
        class="fixed inset-0 z-[61] flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none"
        role="presentation"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lang-modal-title"
          class="pointer-events-auto w-full max-w-md rounded-2xl border border-neon-mint/35 bg-surface-1/95 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.65)] ring-1 ring-neon-purple/15 overflow-hidden"
          @click.stop
        >
          <div class="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-border/40 bg-linear-to-r from-neon-mint/[0.08] via-transparent to-neon-purple/[0.06]">
            <div class="flex items-center gap-2 min-w-0">
              <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neon-mint/15 ring-1 ring-neon-mint/25">
                <Globe class="size-4 text-neon-mint" aria-hidden="true" />
              </div>
              <h2 id="lang-modal-title" class="font-display text-sm font-black tracking-wide text-foreground truncate">
                {{ t('lang.title') }}
              </h2>
            </div>
            <button
              type="button"
              class="flex size-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors touch-press"
              :aria-label="t('lang.close')"
              @click="closeLanguageModal"
            >
              <X class="size-4" aria-hidden="true" />
            </button>
          </div>
          <div class="p-4 max-h-[min(70vh,24rem)] overflow-y-auto">
            <p class="font-body text-[11px] text-muted-foreground mb-3">
              {{ t('lang.description') }}
            </p>
            <ul class="space-y-2" role="listbox" aria-label="言語一覧">
              <li v-for="l in languages" :key="l.code">
                <button
                  type="button"
                  role="option"
                  :aria-selected="lang === l.code"
                  :class="cn(
                    'w-full flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-200 touch-press',
                    lang === l.code
                      ? 'border-neon-mint/45 bg-neon-mint/10 text-foreground ring-1 ring-neon-mint/20'
                      : 'border-border/50 bg-surface-2/45 hover:border-neon-mint/25',
                  )"
                  @click="setLang(l.code)"
                >
                  <div>
                    <p class="font-body text-sm font-semibold">{{ l.label }}</p>
                    <p class="font-body text-[11px] text-muted-foreground/90 mt-0.5">{{ l.note }}</p>
                  </div>
                  <Check
                    v-if="lang === l.code"
                    class="w-4 h-4 text-neon-mint shrink-0"
                    aria-hidden="true"
                  />
                </button>
              </li>
            </ul>
            <p class="font-body text-[10px] text-muted-foreground/75 mt-4 leading-relaxed">
              {{ t('lang.note') }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <nav
    aria-label="Mobile bottom navigation"
    :class="cn(
      'fixed -bottom-[1px] left-0 right-0 z-40 md:hidden',
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
      :aria-label="t('nav.home')"
    >
      <Home class="w-5 h-5 mb-0.5" aria-hidden="true" />
      <span>{{ t('nav.home') }}</span>
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
      ref="mobileMenuOpenBtnRef"
      type="button"
      :aria-label="t('a11y.openMenu')"
      :aria-expanded="open"
      :class="cn(
        'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-body transition-all duration-200 touch-press',
        open ? 'text-neon-mint' : 'text-muted-foreground',
      )"
      @click="open = !open"
    >
      <Menu class="w-5 h-5 mb-0.5" aria-hidden="true" />
      <span>{{ t('nav.menu') }}</span>
    </button>
  </nav>
</template>

<style scoped>
.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.2s ease;
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}
.scale-fade-enter-active {
  transition: opacity 0.25s ease;
}
.scale-fade-leave-active {
  transition: opacity 0.18s ease;
}
.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
}

.nav-submenu-pop-enter-active {
  transition:
    opacity 0.22s cubic-bezier(0.34, 1.4, 0.64, 1),
    transform 0.24s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.nav-submenu-pop-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}
.nav-submenu-pop-enter-from {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
.nav-submenu-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.nav-submenu-expand-enter-active {
  transition:
    opacity 0.22s ease,
    max-height 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav-submenu-expand-leave-active {
  transition:
    opacity 0.16s ease,
    max-height 0.24s cubic-bezier(0.4, 0, 1, 1);
}
.nav-submenu-expand-enter-from,
.nav-submenu-expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.nav-submenu-expand-enter-to,
.nav-submenu-expand-leave-from {
  opacity: 1;
  max-height: 18rem;
}
</style>
