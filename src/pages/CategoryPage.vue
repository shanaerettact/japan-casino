<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Tv2, Cpu, Trophy, Fish, Layers,
  ArrowLeft, Zap, Star, Users, Clock,
  ChevronRight, Play, Shield,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const props = defineProps<{ slug: string }>()
const router = useRouter()


interface CategoryDef {
  slug: string
  label: string
  tagline: string
  icon: unknown
  accentClass: string
  glowClass: string
  borderClass: string
  bgClass: string
  textClass: string
  description: string
  badge: string
}

const categoriesBase: Omit<CategoryDef, 'label' | 'badge'>[] = [
  { slug: 'all',        icon: Zap,    accentClass: 'text-neon-mint',    glowClass: 'glow-mint',    borderClass: 'border-neon-mint/40',    bgClass: 'bg-neon-mint/10',    textClass: 'text-neon-mint',    tagline: 'Every Category. One Place.',    description: '' },
  { slug: 'live',       icon: Tv2,    accentClass: 'text-neon-mint',    glowClass: 'glow-mint',    borderClass: 'border-neon-mint/40',    bgClass: 'bg-neon-mint/10',    textClass: 'text-neon-mint',    tagline: 'Real Dealers. Real Thrills.',   description: '' },
  { slug: 'electronic', icon: Cpu,    accentClass: 'text-neon-purple',  glowClass: 'glow-purple',  borderClass: 'border-neon-purple/40',  bgClass: 'bg-neon-purple/10',  textClass: 'text-neon-purple',  tagline: 'Slots, Machines & Beyond.',    description: '' },
  { slug: 'sports',     icon: Trophy, accentClass: 'text-amber-400',    glowClass: '',             borderClass: 'border-amber-400/40',    bgClass: 'bg-amber-400/10',    textClass: 'text-amber-400',    tagline: 'Your Game. Your Odds.',        description: '' },
  { slug: 'fishing',    icon: Fish,   accentClass: 'text-sky-400',      glowClass: '',             borderClass: 'border-sky-400/40',      bgClass: 'bg-sky-400/10',      textClass: 'text-sky-400',      tagline: 'Cast. Catch. Win.',            description: '' },
  { slug: 'cards',      icon: Layers, accentClass: 'text-neon-purple',  glowClass: 'glow-purple',  borderClass: 'border-neon-purple/40',  bgClass: 'bg-neon-purple/10',  textClass: 'text-neon-purple',  tagline: 'Skill Meets Strategy.',        description: '' },
]

const labelKeys: Record<string, string> = {
  all: 'category.allLabel', live: 'category.liveLabel', electronic: 'category.electronicLabel',
  sports: 'category.sportsLabel', fishing: 'category.fishingLabel', cards: 'category.cardsLabel',
}
const badgeKeys: Record<string, string> = {
  all: 'category.allBadge', live: 'category.liveBadge', electronic: 'category.electronicBadge',
  sports: 'category.sportsBadge', fishing: 'category.fishingBadge', cards: 'category.cardsBadge',
}

const categories = computed<CategoryDef[]>(() =>
  categoriesBase.map((c) => ({
    ...c,
    label: t(labelKeys[c.slug] as Parameters<typeof t>[0]),
    badge: t(badgeKeys[c.slug] as Parameters<typeof t>[0]),
  }))
)

const cat = computed(
  () => categories.value.find((c) => c.slug === props.slug) ?? categories.value[0],
)


interface GameItem {
  id: number
  title: string
  subtitle: string
  rating: number
  players: string
  image: string
  tag: string
}

const gameMap: Record<string, GameItem[]> = {
  live: [
    { id: 1, title: 'Lightning Baccarat', subtitle: 'Live Table',  rating: 4.9, players: '12.4K', image: '/images/game/BlackjackLink.jpg',  tag: 'HOT'  },
    { id: 2, title: 'Neon Roulette',      subtitle: 'Live Table',  rating: 4.8, players: '8.1K',  image: '/images/game/GcLottery.png',       tag: 'NEW'  },
    { id: 3, title: 'Cyber Blackjack',    subtitle: 'Live Table',  rating: 4.7, players: '6.3K',  image: '/images/game/baphomet.png',        tag: 'HOT'  },
    { id: 4, title: 'Dragon Tiger Live',  subtitle: 'Live Table',  rating: 4.6, players: '5.7K',  image: '/images/game/BookofDead.jpg',      tag: 'LIVE' },
    { id: 5, title: 'Sic Bo Infinity',    subtitle: 'Live Table',  rating: 4.5, players: '4.2K',  image: '/images/game/StormOfSeth2.png',    tag: 'LIVE' },
    { id: 6, title: 'Mega Wheel',         subtitle: 'Game Show',   rating: 4.8, players: '9.9K',  image: '/images/game/BigBassSplash.jpg',   tag: 'HOT'  },
  ],
  electronic: [
    { id: 1, title: 'Big Bass Splash',   subtitle: 'Progressive Jackpot', rating: 4.9, players: '22K', image: '/images/game/BigBassSplash.jpg',  tag: 'NEW'  },
    { id: 2, title: 'Storm of Seth II',  subtitle: '5-Reel Slot',         rating: 4.7, players: '18K', image: '/images/game/StormOfSeth2.png',   tag: 'HOT'  },
    { id: 3, title: 'Book of Dead',      subtitle: 'Adventure Slot',      rating: 4.8, players: '31K', image: '/images/game/BookofDead.jpg',     tag: 'HOT'  },
    { id: 4, title: 'GC Lottery',        subtitle: 'Lottery Slot',        rating: 4.5, players: '11K', image: '/images/game/GcLottery.png',      tag: 'FREE' },
    { id: 5, title: 'Cyber Reel 3',      subtitle: 'Megaways™',           rating: 4.6, players: '14K', image: '/images/game/3.png',              tag: 'NEW'  },
    { id: 6, title: 'Baphomet Reels',    subtitle: 'Dark Fantasy Slot',   rating: 4.4, players: '7K',  image: '/images/game/baphomet.png',       tag: 'FREE' },
  ],
  sports: [
    { id: 1, title: 'World Football',   subtitle: 'Live Betting',   rating: 4.9, players: '45K', image: '/images/game/StormOfSeth2.png',  tag: 'LIVE' },
    { id: 2, title: 'NBA Showdown',      subtitle: 'Live Betting',   rating: 4.8, players: '31K', image: '/images/game/3.png',             tag: 'HOT'  },
    { id: 3, title: 'Esports Arena',     subtitle: 'Match Betting',  rating: 4.7, players: '28K', image: '/images/game/GcLottery.png',     tag: 'NEW'  },
    { id: 4, title: 'MMA Cage Odds',     subtitle: 'Fight Betting',  rating: 4.6, players: '16K', image: '/images/game/BigBassSplash.jpg', tag: 'HOT'  },
    { id: 5, title: 'Baseball Pro',      subtitle: 'Season Betting', rating: 4.5, players: '14K', image: '/images/game/baphomet.png',      tag: 'LIVE' },
    { id: 6, title: 'Virtual Racing',    subtitle: 'Simulation',     rating: 4.4, players: '9K',  image: '/images/game/BookofDead.jpg',    tag: 'FREE' },
  ],
  fishing: [
    { id: 1, title: 'Ice Fishing King',   subtitle: 'Arctic Hunt',    rating: 4.9, players: '11K', image: '/images/game/IceFishing.jpg',     tag: 'HOT'  },
    { id: 2, title: 'Big Bass Aqua',      subtitle: 'Arcade Shooter', rating: 4.8, players: '9K',  image: '/images/game/BigBassSplash.jpg',  tag: 'NEW'  },
    { id: 3, title: 'Baphomet Deep',      subtitle: 'Boss Battle',    rating: 4.7, players: '8K',  image: '/images/game/baphomet.png',       tag: 'HOT'  },
    { id: 4, title: 'Cyber Aqua Raid',    subtitle: 'Coop Mode',      rating: 4.6, players: '6K',  image: '/images/game/3.png',              tag: 'LIVE' },
    { id: 5, title: 'GC Ocean Lottery',   subtitle: 'Tournament',     rating: 4.5, players: '5K',  image: '/images/game/GcLottery.png',      tag: 'FREE' },
    { id: 6, title: 'Storm Fisher',       subtitle: 'Special Event',  rating: 4.4, players: '4K',  image: '/images/game/StormOfSeth2.png',   tag: 'NEW'  },
  ],
  cards: [
    { id: 1, title: "Texas Hold'em Pro",  subtitle: 'Poker Room',     rating: 4.9, players: '33K', image: '/images/game/BlackjackLink.jpg', tag: 'HOT'  },
    { id: 2, title: 'Book of Dead Poker', subtitle: 'Card Adventure', rating: 4.8, players: '27K', image: '/images/game/BookofDead.jpg',    tag: 'LIVE' },
    { id: 3, title: 'Baphomet Blackjack', subtitle: 'Strategy Game',  rating: 4.7, players: '21K', image: '/images/game/baphomet.png',      tag: 'HOT'  },
    { id: 4, title: 'GC Mahjong',         subtitle: 'Asian Classic',  rating: 4.6, players: '18K', image: '/images/game/GcLottery.png',     tag: 'NEW'  },
    { id: 5, title: 'Storm Poker Royale', subtitle: 'Tournament',     rating: 4.5, players: '14K', image: '/images/game/StormOfSeth2.png',  tag: 'HOT'  },
    { id: 6, title: 'Seth War Showdown',  subtitle: 'Quick Game',     rating: 4.3, players: '8K',  image: '/images/game/3.png',             tag: 'FREE' },
  ],
}


const allSections = computed(() =>
  categories.value
    .filter((c) => c.slug !== 'all')
    .map((c) => ({ cat: c, games: gameMap[c.slug] ?? [] })),
)

const games = computed(() => gameMap[props.slug] ?? gameMap['live'])
const isAll = computed(() => props.slug === 'all')


interface Highlight {
  icon: unknown
  label: string
  value: string
}

const highlightMap: Record<string, Highlight[]> = {
  all:        [{ icon: Zap, label: 'Total Games', value: '800+' }, { icon: Users, label: 'Players Online', value: '120K+' }, { icon: Shield, label: 'Categories', value: '5' }],
  live:       [{ icon: Users, label: 'Online Now', value: '46K+' }, { icon: Tv2, label: 'Live Tables', value: '200+' },    { icon: Shield, label: 'Certified Fair', value: '100%' }],
  electronic: [{ icon: Cpu,   label: 'Game Titles', value: '500+' }, { icon: Star, label: 'Jackpots',    value: '32 Active' }, { icon: Trophy, label: 'Top Payout', value: '98.7%' }],
  sports:     [{ icon: Trophy, label: 'Sport Types', value: '40+' }, { icon: Zap, label: 'Live Events',  value: '1,200+' },  { icon: Shield, label: 'Instant Payout', value: '24/7' }],
  fishing:    [{ icon: Fish,  label: 'Game Rooms', value: '80+' },   { icon: Users, label: 'Players',    value: '50K+' },    { icon: Star, label: 'Max Multiplier', value: '×999' }],
  cards:      [{ icon: Layers, label: 'Card Games', value: '30+' },  { icon: Trophy, label: 'Tournaments', value: 'Daily' }, { icon: Users, label: 'Active Tables', value: '3,500+' }],
}

const highlights = computed(() => highlightMap[props.slug] ?? highlightMap['all'])


const tagColors: Record<string, string> = {
  HOT:  'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
  NEW:  'bg-neon-mint/20 text-neon-mint border-neon-mint/30',
  LIVE: 'bg-amber-400/20 text-amber-400 border-amber-400/30',
  FREE: 'bg-sky-400/20 text-sky-400 border-sky-400/30',
}


const navCategories = computed(() => [
  { slug: 'all',        label: t('category.navAll'),        icon: Zap },
  { slug: 'live',       label: t('category.navLive'),       icon: Tv2 },
  { slug: 'electronic', label: t('category.navElectronic'), icon: Cpu },
  { slug: 'sports',     label: t('category.navSports'),     icon: Trophy },
  { slug: 'fishing',    label: t('category.navFishing'),    icon: Fish },
  { slug: 'cards',      label: t('category.navCards'),      icon: Layers },
])

const sectionCounts: Record<string, number> = {
  live:       4,
  electronic: 6,
  sports:     4,
  fishing:    6,
  cards:      4,
}


const hoveredGame = ref<string | null>(null)

function goBack() {
  router.push('/')
}

function gameKey(sectionSlug: string, id: number) {
  return `${sectionSlug}-${id}`
}
</script>

<template>
  <div class="min-h-screen bg-background">

    
    <section
      class="relative overflow-hidden pt-20 "
      :aria-label="`${cat.label} hero`"
    >
      
      <div
        class="absolute inset-0 opacity-[0.04]"
        style="
          background-image:
            linear-gradient(oklch(0.82 0.19 168) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.82 0.19 168) 1px, transparent 1px);
        "
        aria-hidden="true"
      />
      
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-15 pointer-events-none"
        :class="cat.bgClass"
        aria-hidden="true"
      />
      
      <div class="absolute inset-0 scanline pointer-events-none" aria-hidden="true" />
    </section>

    
    <nav
      aria-label="Game categories"
      class="sticky top-16 z-30 bg-background/90 backdrop-blur-xl border-b border-border"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          class="flex items-center gap-2 overflow-x-auto hide-scrollbar py-3"
          role="tablist"
        >
          <RouterLink
            v-for="nc in navCategories"
            :key="nc.slug"
            :to="`/category/${nc.slug}`"
            role="tab"
            :aria-selected="nc.slug === slug"
            :class="cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all duration-200 shrink-0 touch-press border',
              nc.slug === slug
                ? 'bg-neon-purple/20 text-neon-purple border-neon-purple/40'
                : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-surface-2',
            )"
          >
            <component :is="nc.icon" class="w-4 h-4" aria-hidden="true" />
            {{ nc.label }}
          </RouterLink>
        </div>
      </div>
    </nav>

    
    <template v-if="isAll">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section
            v-for="section in allSections"
            :key="section.cat.slug"
            :class="cn(
              'glass-card rounded-2xl overflow-hidden border',
              section.cat.borderClass,
            )"
            :aria-labelledby="`all-${section.cat.slug}-heading`"
          >
            <!-- Section header -->
            <div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border/50">
              <div class="flex items-center gap-3">
                <div
                  :class="cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center border shrink-0',
                    section.cat.bgClass, section.cat.borderClass,
                  )"
                >
                  <component :is="section.cat.icon" :class="cn('w-4 h-4', section.cat.accentClass)" aria-hidden="true" />
                </div>
                <div>
                  <p :class="cn('text-[10px] font-mono font-semibold tracking-widest uppercase mb-0.5', section.cat.textClass)">
                    {{ section.cat.badge }}
                  </p>
                  <h2
                    :id="`all-${section.cat.slug}-heading`"
                    class="font-display font-black text-base text-foreground leading-tight"
                  >
                    {{ section.cat.label.split(' ')[0] }}
                    <span :class="section.cat.accentClass">
                      {{ section.cat.label.split(' ').slice(1).join(' ') || t('category.games') }}
                    </span>
                  </h2>
                </div>
              </div>

              <RouterLink
                :to="`/category/${section.cat.slug}`"
                :class="cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-body font-medium shrink-0',
                  'border transition-all duration-200 touch-press',
                  section.cat.borderClass, section.cat.textClass,
                  'hover:opacity-80',
                )"
              >
                {{ t('category.viewAll') }}
                <ChevronRight class="w-3.5 h-3.5" aria-hidden="true" />
              </RouterLink>
            </div>

            <!-- Game cards — 2-column -->
            <div class="grid grid-cols-2 gap-3 p-4" role="list">
              <article
                v-for="(game, i) in section.games.slice(0, sectionCounts[section.cat.slug] ?? 4)"
                :key="game.id"
                role="listitem"
                :class="cn(
                  'group relative rounded-xl overflow-hidden cursor-pointer',
                  'bg-surface-1 border transition-all duration-300',
                  hoveredGame === gameKey(section.cat.slug, game.id)
                    ? `-translate-y-0.5 ${section.cat.glowClass} ${section.cat.borderClass}`
                    : 'border-border',
                )"
                :style="{ animationDelay: `${i * 0.06}s` }"
                :aria-label="`${game.title} — ${game.subtitle}`"
                @mouseenter="hoveredGame = gameKey(section.cat.slug, game.id)"
                @mouseleave="hoveredGame = null"
              >
                <!-- Image -->
                <div class="relative h-28 overflow-hidden">
                  <img
                    :src="game.image"
                    :alt="`${game.title} thumbnail`"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div class="absolute inset-0 bg-linear-to-t from-surface-1 via-transparent to-transparent" />
                  <span
                    :class="cn(
                      'absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-display font-bold tracking-widest border',
                      tagColors[game.tag] ?? 'bg-surface-2 text-foreground border-border',
                    )"
                  >
                    {{ game.tag }}
                  </span>
                  <div class="absolute top-2 right-2 flex items-center gap-0.5 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                    <Star class="w-2.5 h-2.5 text-amber-400 fill-amber-400" aria-hidden="true" />
                    <span class="text-[9px] font-display font-bold text-foreground">{{ game.rating }}</span>
                  </div>
                  <div
                    :class="cn(
                      'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
                      hoveredGame === gameKey(section.cat.slug, game.id) ? 'opacity-100' : 'opacity-0',
                    )"
                    aria-hidden="true"
                  >
                    <div class="w-9 h-9 rounded-full bg-neon-purple/80 border-2 border-neon-purple flex items-center justify-center glow-purple">
                      <Play class="w-4 h-4 text-primary-foreground fill-primary-foreground ml-0.5" />
                    </div>
                  </div>
                </div>

                <!-- Info -->
                <div class="p-2.5">
                  <h3 class="font-display font-black text-[11px] text-foreground leading-tight tracking-wide truncate">
                    {{ game.title }}
                  </h3>
                  <p :class="cn('text-[10px] font-body mt-0.5 truncate', section.cat.accentClass)">{{ game.subtitle }}</p>
                  <div class="flex items-center gap-1.5 mt-2 pt-2 border-t border-border">
                    <Users class="w-2.5 h-2.5 text-neon-mint shrink-0" aria-hidden="true" />
                    <span class="text-[9px] font-body text-muted-foreground truncate">{{ game.players }}</span>
                    <button
                      type="button"
                      :class="cn('ml-auto text-[9px] font-display font-bold touch-press transition-colors duration-200 shrink-0', section.cat.accentClass)"
                      :aria-label="`Play ${game.title}`"
                    >
                      {{ t('category.play') }}
                    </button>
                  </div>
                </div>

                <!-- Bottom accent line -->
                <div
                  :class="cn(
                    'absolute bottom-0 left-0 right-0 h-[2px] transition-opacity duration-300',
                    'bg-linear-to-r from-neon-purple via-neon-mint to-neon-purple',
                    hoveredGame === gameKey(section.cat.slug, game.id) ? 'opacity-100' : 'opacity-0',
                  )"
                  aria-hidden="true"
                />
              </article>
            </div>
          </section>
        </div>
      </div>
    </template>

    
    <template v-else>
      <section
        class="py-12 sm:py-16"
        :aria-labelledby="`${cat.slug}-games-heading`"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6">

          
          <div class="flex items-center justify-between mb-8">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <div :class="cn('h-[2px] w-6 rounded-full', cat.textClass)" aria-hidden="true" />
                <span :class="cn('text-xs font-body font-semibold tracking-widest uppercase', cat.textClass)">
                  {{ t('category.topGames') }}
                </span>
              </div>
              <h2
                :id="`${cat.slug}-games-heading`"
                class="font-display font-black text-2xl sm:text-3xl text-foreground"
              >
                {{ t('category.popularPicksA') }} <span :class="cat.accentClass">{{ t('category.popularPicksB') }}</span>
              </h2>
            </div>
            <button
              type="button"
              :class="cn(
                'hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-body font-medium',
                'border transition-all duration-200 touch-press',
                cat.borderClass, cat.textClass,
                'hover:opacity-80',
              )"
            >
              {{ t('category.viewAll') }}
              <ChevronRight class="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            role="list"
          >
            <article
              v-for="(game, i) in games"
              :key="game.id"
              role="listitem"
              :class="cn(
                'group relative rounded-2xl overflow-hidden cursor-pointer',
                'bg-surface-1 border transition-all duration-300',
                hoveredGame === gameKey(cat.slug, game.id)
                  ? `border-opacity-60 -translate-y-1 ${cat.glowClass}`
                  : 'border-border',
              )"
              :style="{ animationDelay: `${i * 0.06}s` }"
              :aria-label="`${game.title} — ${game.subtitle}`"
              @mouseenter="hoveredGame = gameKey(cat.slug, game.id)"
              @mouseleave="hoveredGame = null"
            >
              
              <div class="relative h-44 overflow-hidden">
                <img
                  :src="game.image"
                  :alt="`${game.title} thumbnail`"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-linear-to-t from-surface-1 via-transparent to-transparent" />

                
                <span
                  :class="cn(
                    'absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-display font-bold tracking-widest border',
                    tagColors[game.tag] ?? 'bg-surface-2 text-foreground border-border',
                  )"
                >
                  {{ game.tag }}
                </span>

                
                <div class="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <Star class="w-3 h-3 text-amber-400 fill-amber-400" aria-hidden="true" />
                  <span class="text-xs font-display font-bold text-foreground">{{ game.rating }}</span>
                </div>

                
                <div
                  :class="cn(
                    'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
                    hoveredGame === gameKey(cat.slug, game.id) ? 'opacity-100' : 'opacity-0',
                  )"
                  aria-hidden="true"
                >
                  <div class="w-14 h-14 rounded-full bg-neon-purple/80 border-2 border-neon-purple flex items-center justify-center glow-purple">
                    <Play class="w-6 h-6 text-primary-foreground fill-primary-foreground ml-0.5" />
                  </div>
                </div>
              </div>

              
              <div class="p-4">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <div class="min-w-0">
                    <h3 class="font-display font-black text-sm text-foreground leading-tight tracking-wide truncate">
                      {{ game.title }}
                    </h3>
                    <p :class="cn('text-xs font-body mt-0.5', cat.accentClass)">{{ game.subtitle }}</p>
                  </div>
                </div>

                
                <div class="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                  <div class="flex items-center gap-1 text-xs font-body text-muted-foreground">
                    <Users class="w-3.5 h-3.5 text-neon-mint" aria-hidden="true" />
                    <span>{{ game.players }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-xs font-body text-muted-foreground">
                    <Clock class="w-3.5 h-3.5 text-neon-purple" aria-hidden="true" />
                    <span>{{ t('category.available') }}</span>
                  </div>
                  <button
                    type="button"
                    :class="cn(
                      'ml-auto text-xs font-display font-bold touch-press transition-colors duration-200',
                      cat.accentClass,
                    )"
                    :aria-label="`Play ${game.title}`"
                  >
                    {{ t('category.play') }}
                  </button>
                </div>
              </div>

              
              <div
                :class="cn(
                  'absolute bottom-0 left-0 right-0 h-[2px] transition-opacity duration-300',
                  'bg-linear-to-r from-neon-purple via-neon-mint to-neon-purple',
                  hoveredGame === gameKey(cat.slug, game.id) ? 'opacity-100' : 'opacity-0',
                )"
                aria-hidden="true"
              />
            </article>
          </div>
        </div>
      </section>
    </template>

    
  </div>
</template>
