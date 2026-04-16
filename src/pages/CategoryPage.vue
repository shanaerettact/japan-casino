<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Tv2, Cpu, Trophy, Fish, Layers,
  ArrowLeft, Zap, Star, Users, Clock,
  ChevronRight, Play, Shield,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'

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

const categories: CategoryDef[] = [
  {
    slug: 'all',
    label: 'All Games',
    tagline: 'Every Category. One Place.',
    icon: Zap,
    accentClass: 'text-neon-mint',
    glowClass: 'glow-mint',
    borderClass: 'border-neon-mint/40',
    bgClass: 'bg-neon-mint/10',
    textClass: 'text-neon-mint',
    description:
      'Explore the full NekoVerse game library — from live dealer tables and electronic slots to sports betting, fishing arcades, and card tournaments. Find your next favourite in one place.',
    badge: 'ALL CATEGORIES',
  },
  {
    slug: 'live',
    label: 'Live Entertainment',
    tagline: 'Real Dealers. Real Thrills.',
    icon: Tv2,
    accentClass: 'text-neon-mint',
    glowClass: 'glow-mint',
    borderClass: 'border-neon-mint/40',
    bgClass: 'bg-neon-mint/10',
    textClass: 'text-neon-mint',
    description:
      'Immerse yourself in a live-streamed casino experience with professional dealers, real-time interaction, and cinematic production. Play Baccarat, Roulette, Blackjack, and more — broadcast 24/7 from our state-of-the-art studios.',
    badge: 'LIVE NOW',
  },
  {
    slug: 'electronic',
    label: 'Electronic Games',
    tagline: 'Slots, Machines & Beyond.',
    icon: Cpu,
    accentClass: 'text-neon-purple',
    glowClass: 'glow-purple',
    borderClass: 'border-neon-purple/40',
    bgClass: 'bg-neon-purple/10',
    textClass: 'text-neon-purple',
    description:
      'Hundreds of slot machines, video poker terminals, and electronic table games engineered for maximum excitement. From classic 3-reel slots to progressive jackpot networks — spin your way to victory.',
    badge: '500+ TITLES',
  },
  {
    slug: 'sports',
    label: 'Sports Betting',
    tagline: 'Your Game. Your Odds.',
    icon: Trophy,
    accentClass: 'text-amber-400',
    glowClass: '',
    borderClass: 'border-amber-400/40',
    bgClass: 'bg-amber-400/10',
    textClass: 'text-amber-400',
    description:
      'Place bets on thousands of sporting events around the world — football, basketball, baseball, MMA, esports, and more. Real-time odds, live in-play betting, and expert analytics at your fingertips.',
    badge: 'LIVE ODDS',
  },
  {
    slug: 'fishing',
    label: 'Fishing Games',
    tagline: 'Cast. Catch. Win.',
    icon: Fish,
    accentClass: 'text-sky-400',
    glowClass: '',
    borderClass: 'border-sky-400/40',
    bgClass: 'bg-sky-400/10',
    textClass: 'text-sky-400',
    description:
      'Dive into vibrant underwater worlds and compete to land the biggest hauls. Earn multipliers, unlock rare species, and climb leaderboards in our arcade-style fishing game collection.',
    badge: 'ARCADE',
  },
  {
    slug: 'cards',
    label: 'Card Games',
    tagline: 'Skill Meets Strategy.',
    icon: Layers,
    accentClass: 'text-neon-purple',
    glowClass: 'glow-purple',
    borderClass: 'border-neon-purple/40',
    bgClass: 'bg-neon-purple/10',
    textClass: 'text-neon-purple',
    description:
      'Master the art of Poker, Baccarat, Blackjack, and traditional Asian card games. Choose between player-vs-player tables, AI opponents, and tournament brackets with prize pools.',
    badge: 'TOURNAMENTS',
  },
]

const cat = computed(
  () => categories.find((c) => c.slug === props.slug) ?? categories[0],
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
    { id: 1, title: 'Lightning Baccarat', subtitle: 'Live Table', rating: 4.9, players: '12.4K', image: '/images/game-1.jpg', tag: 'HOT' },
    { id: 2, title: 'Neon Roulette',       subtitle: 'Live Table', rating: 4.8, players: '8.1K',  image: '/images/game-2.jpg', tag: 'NEW' },
    { id: 3, title: 'Cyber Blackjack',     subtitle: 'Live Table', rating: 4.7, players: '6.3K',  image: '/images/game-3.jpg', tag: 'HOT' },
    { id: 4, title: 'Dragon Tiger Live',   subtitle: 'Live Table', rating: 4.6, players: '5.7K',  image: '/images/game-4.jpg', tag: 'LIVE' },
    { id: 5, title: 'Sic Bo Infinity',     subtitle: 'Live Table', rating: 4.5, players: '4.2K',  image: '/images/game-5.jpg', tag: 'LIVE' },
    { id: 6, title: 'Mega Wheel',          subtitle: 'Game Show',  rating: 4.8, players: '9.9K',  image: '/images/game-1.jpg', tag: 'HOT' },
  ],
  electronic: [
    { id: 1, title: 'Cyber Slots X',  subtitle: 'Progressive Jackpot', rating: 4.9, players: '22K',  image: '/images/game-2.jpg', tag: 'NEW' },
    { id: 2, title: 'Mech Reel 9000', subtitle: '5-Reel Slot',         rating: 4.7, players: '18K',  image: '/images/game-3.jpg', tag: 'HOT' },
    { id: 3, title: 'Neon Fortune',   subtitle: 'Video Poker',          rating: 4.6, players: '14K',  image: '/images/game-4.jpg', tag: 'HOT' },
    { id: 4, title: 'Ghost Reels',    subtitle: '3-Reel Classic',       rating: 4.5, players: '11K',  image: '/images/game-5.jpg', tag: 'FREE' },
    { id: 5, title: 'Quantum Spin',   subtitle: 'Megaways™',            rating: 4.8, players: '19K',  image: '/images/game-1.jpg', tag: 'NEW' },
    { id: 6, title: 'Digital Derby',  subtitle: 'Skill Machine',        rating: 4.4, players: '7K',   image: '/images/game-2.jpg', tag: 'FREE' },
  ],
  sports: [
    { id: 1, title: 'World Football', subtitle: 'Live Betting',   rating: 4.9, players: '45K',  image: '/images/game-3.jpg', tag: 'LIVE' },
    { id: 2, title: 'NBA Showdown',   subtitle: 'Live Betting',   rating: 4.8, players: '31K',  image: '/images/game-4.jpg', tag: 'HOT' },
    { id: 3, title: 'Esports Arena',  subtitle: 'Match Betting',  rating: 4.7, players: '28K',  image: '/images/game-5.jpg', tag: 'NEW' },
    { id: 4, title: 'MMA Cage Odds',  subtitle: 'Fight Betting',  rating: 4.6, players: '16K',  image: '/images/game-1.jpg', tag: 'HOT' },
    { id: 5, title: 'Baseball Pro',   subtitle: 'Season Betting', rating: 4.5, players: '14K',  image: '/images/game-2.jpg', tag: 'LIVE' },
    { id: 6, title: 'Virtual Racing', subtitle: 'Simulation',     rating: 4.4, players: '9K',   image: '/images/game-3.jpg', tag: 'FREE' },
  ],
  fishing: [
    { id: 1, title: 'Deep Sea Hunter',  subtitle: 'Multiplayer',    rating: 4.9, players: '11K',  image: '/images/game-4.jpg', tag: 'HOT' },
    { id: 2, title: 'Neon Ocean Blast', subtitle: 'Arcade Shooter', rating: 4.8, players: '9K',   image: '/images/game-5.jpg', tag: 'NEW' },
    { id: 3, title: 'Dragon Fish King', subtitle: 'Boss Battle',    rating: 4.7, players: '8K',   image: '/images/game-1.jpg', tag: 'HOT' },
    { id: 4, title: 'Cyber Aqua Raid',  subtitle: 'Coop Mode',      rating: 4.6, players: '6K',   image: '/images/game-2.jpg', tag: 'LIVE' },
    { id: 5, title: 'Golden Koi Clash', subtitle: 'Tournament',     rating: 4.5, players: '5K',   image: '/images/game-3.jpg', tag: 'FREE' },
    { id: 6, title: 'Space Whale Hunt', subtitle: 'Special Event',  rating: 4.4, players: '4K',   image: '/images/game-4.jpg', tag: 'NEW' },
  ],
  cards: [
    { id: 1, title: "Texas Hold'em Pro", subtitle: 'Poker Room',    rating: 4.9, players: '33K',  image: '/images/game-5.jpg', tag: 'HOT' },
    { id: 2, title: 'Speed Baccarat',    subtitle: 'Card Game',     rating: 4.8, players: '27K',  image: '/images/game-1.jpg', tag: 'LIVE' },
    { id: 3, title: 'Blackjack Elite',   subtitle: 'Strategy Game', rating: 4.7, players: '21K',  image: '/images/game-2.jpg', tag: 'HOT' },
    { id: 4, title: 'Mahjong Clash',     subtitle: 'Asian Classic', rating: 4.6, players: '18K',  image: '/images/game-3.jpg', tag: 'NEW' },
    { id: 5, title: 'Poker Royale',      subtitle: 'Tournament',    rating: 4.5, players: '14K',  image: '/images/game-4.jpg', tag: 'HOT' },
    { id: 6, title: 'War Card Showdown', subtitle: 'Quick Game',    rating: 4.3, players: '8K',   image: '/images/game-5.jpg', tag: 'FREE' },
  ],
}


const allSections = computed(() =>
  categories
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


const navCategories = [
  { slug: 'all',       label: 'All Games',  icon: Zap },
  { slug: 'live',      label: 'Live',       icon: Tv2 },
  { slug: 'electronic',label: 'Electronic', icon: Cpu },
  { slug: 'sports',    label: 'Sports',     icon: Trophy },
  { slug: 'fishing',   label: 'Fishing',    icon: Fish },
  { slug: 'cards',     label: 'Cards',      icon: Layers },
]


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
      class="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20"
      :aria-label="`${cat.label} hero`"
    >
      
      <div
        class="absolute inset-0 opacity-[0.04]"
        style="
          background-image:
            linear-gradient(oklch(0.82 0.19 168) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.82 0.19 168) 1px, transparent 1px);
          background-size: 48px 48px;
        "
        aria-hidden="true"
      />
      
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-15 pointer-events-none"
        :class="cat.bgClass"
        aria-hidden="true"
      />
      
      <div class="absolute inset-0 scanline pointer-events-none" aria-hidden="true" />

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        
        <button
          type="button"
          :class="cn(
            'inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-xl text-sm font-body',
            'text-muted-foreground border border-border bg-surface-1',
            'hover:text-foreground hover:border-border/80 transition-all duration-200 touch-press',
          )"
          aria-label="Back to home"
          @click="goBack"
        >
          <ArrowLeft class="w-4 h-4" aria-hidden="true" />
          Back to Home
        </button>

        
        <div class="flex items-center gap-3 mb-4">
          <div
            :class="cn(
              'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border',
              cat.bgClass, cat.borderClass,
            )"
          >
            <component :is="cat.icon" :class="cn('w-6 h-6 sm:w-7 sm:h-7', cat.accentClass)" aria-hidden="true" />
          </div>
          <div>
            <span
              :class="cn(
                'inline-block text-[10px] font-display font-bold tracking-widest px-2.5 py-1 rounded-lg border mb-1',
                cat.bgClass, cat.borderClass, cat.textClass,
              )"
            >
              {{ cat.badge }}
            </span>
            <p class="text-xs font-body text-muted-foreground">{{ cat.tagline }}</p>
          </div>
        </div>

        
        <h1
          :class="cn(
            'font-display font-black text-balance leading-tight',
            'text-4xl sm:text-5xl md:text-6xl text-foreground mb-4',
          )"
        >
          {{ cat.label.split(' ')[0] }}
          <span :class="cat.accentClass">
            {{ cat.label.split(' ').slice(1).join(' ') || 'Games' }}
          </span>
        </h1>

        
        <p class="max-w-2xl text-sm sm:text-base font-body text-muted-foreground leading-relaxed">
          {{ cat.description }}
        </p>

        
        <div class="flex flex-wrap gap-4 mt-8">
          <div
            v-for="h in highlights"
            :key="h.label"
            :class="cn(
              'flex items-center gap-3 px-4 py-3 rounded-2xl border bg-surface-1',
              cat.borderClass,
            )"
          >
            <div :class="cn('p-1.5 rounded-xl', cat.bgClass)">
              <component :is="h.icon" :class="cn('w-4 h-4', cat.accentClass)" aria-hidden="true" />
            </div>
            <div>
              <div :class="cn('font-display font-black text-base leading-none', cat.accentClass)">{{ h.value }}</div>
              <div class="text-xs font-body text-muted-foreground mt-0.5">{{ h.label }}</div>
            </div>
          </div>
        </div>
      </div>
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
      <section
        v-for="section in allSections"
        :key="section.cat.slug"
        class="py-12 sm:py-14 border-b border-border last:border-b-0"
        :aria-labelledby="`all-${section.cat.slug}-heading`"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6">

          
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
              
              <div
                :class="cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center border shrink-0',
                  section.cat.bgClass, section.cat.borderClass,
                )"
              >
                <component :is="section.cat.icon" :class="cn('w-5 h-5', section.cat.accentClass)" aria-hidden="true" />
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <div :class="cn('h-[2px] w-5 rounded-full', section.cat.textClass)" aria-hidden="true" />
                  <span :class="cn('text-xs font-body font-semibold tracking-widest uppercase', section.cat.textClass)">
                    {{ section.cat.badge }}
                  </span>
                </div>
                <h2
                  :id="`all-${section.cat.slug}-heading`"
                  class="font-display font-black text-xl sm:text-2xl text-foreground"
                >
                  {{ section.cat.label.split(' ')[0] }}
                  <span :class="section.cat.accentClass">
                    {{ section.cat.label.split(' ').slice(1).join(' ') || 'Games' }}
                  </span>
                </h2>
              </div>
            </div>

            <RouterLink
              :to="`/category/${section.cat.slug}`"
              :class="cn(
                'hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-body font-medium',
                'border transition-all duration-200 touch-press',
                section.cat.borderClass, section.cat.textClass,
                'hover:opacity-80',
              )"
            >
              View All
              <ChevronRight class="w-4 h-4" aria-hidden="true" />
            </RouterLink>
          </div>

          
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            role="list"
          >
            <article
              v-for="(game, i) in section.games.slice(0, 3)"
              :key="game.id"
              role="listitem"
              :class="cn(
                'group relative rounded-2xl overflow-hidden cursor-pointer',
                'bg-surface-1 border transition-all duration-300',
                hoveredGame === gameKey(section.cat.slug, game.id)
                  ? `border-opacity-60 -translate-y-1 ${section.cat.glowClass}`
                  : 'border-border',
              )"
              :style="{ animationDelay: `${i * 0.06}s` }"
              :aria-label="`${game.title} — ${game.subtitle}`"
              @mouseenter="hoveredGame = gameKey(section.cat.slug, game.id)"
              @mouseleave="hoveredGame = null"
            >
              
              <div class="relative h-40 overflow-hidden">
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
                    hoveredGame === gameKey(section.cat.slug, game.id) ? 'opacity-100' : 'opacity-0',
                  )"
                  aria-hidden="true"
                >
                  <div class="w-12 h-12 rounded-full bg-neon-purple/80 border-2 border-neon-purple flex items-center justify-center glow-purple">
                    <Play class="w-5 h-5 text-primary-foreground fill-primary-foreground ml-0.5" />
                  </div>
                </div>
              </div>

              
              <div class="p-4">
                <h3 class="font-display font-black text-sm text-foreground leading-tight tracking-wide truncate">
                  {{ game.title }}
                </h3>
                <p :class="cn('text-xs font-body mt-0.5', section.cat.accentClass)">{{ game.subtitle }}</p>

                <div class="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                  <div class="flex items-center gap-1 text-xs font-body text-muted-foreground">
                    <Users class="w-3.5 h-3.5 text-neon-mint" aria-hidden="true" />
                    <span>{{ game.players }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-xs font-body text-muted-foreground">
                    <Clock class="w-3.5 h-3.5 text-neon-purple" aria-hidden="true" />
                    <span>Available</span>
                  </div>
                  <button
                    type="button"
                    :class="cn(
                      'ml-auto text-xs font-display font-bold touch-press transition-colors duration-200',
                      section.cat.accentClass,
                    )"
                    :aria-label="`Play ${game.title}`"
                  >
                    PLAY →
                  </button>
                </div>
              </div>

              
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

          
          <div class="mt-6 sm:hidden">
            <RouterLink
              :to="`/category/${section.cat.slug}`"
              :class="cn(
                'flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-2xl',
                'font-display font-bold text-sm tracking-wider border touch-press',
                section.cat.borderClass, section.cat.textClass,
                'hover:opacity-80 transition-opacity duration-200',
              )"
            >
              View All {{ section.cat.label }}
              <ChevronRight class="w-4 h-4" aria-hidden="true" />
            </RouterLink>
          </div>
        </div>
      </section>
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
                  Top Games
                </span>
              </div>
              <h2
                :id="`${cat.slug}-games-heading`"
                class="font-display font-black text-2xl sm:text-3xl text-foreground"
              >
                Popular <span :class="cat.accentClass">Picks</span>
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
              View All
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
                    <span>Available</span>
                  </div>
                  <button
                    type="button"
                    :class="cn(
                      'ml-auto text-xs font-display font-bold touch-press transition-colors duration-200',
                      cat.accentClass,
                    )"
                    :aria-label="`Play ${game.title}`"
                  >
                    PLAY →
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

          
          <div class="mt-8 sm:hidden">
            <button
              type="button"
              :class="cn(
                'flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-2xl',
                'font-display font-bold text-sm tracking-wider border touch-press',
                cat.borderClass, cat.textClass,
                'hover:opacity-80 transition-opacity duration-200',
              )"
            >
              View All Games
              <ChevronRight class="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </template>

    
    <section
      class="py-12 sm:py-16"
      aria-label="Call to action"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          :class="cn(
            'relative overflow-hidden rounded-3xl p-8 sm:p-12 border',
            'bg-surface-1', cat.borderClass,
          )"
        >
          
          <div
            class="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none"
            :class="cat.bgClass"
            aria-hidden="true"
          />
          <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 class="font-display font-black text-2xl sm:text-3xl text-foreground mb-2 text-balance">
                Ready to Play <span :class="cat.accentClass">{{ cat.label }}?</span>
              </h2>
              <p class="text-sm font-body text-muted-foreground max-w-md">
                Join millions of players. New titles added every week. Sign up in seconds and claim your welcome bonus.
              </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <a
                href="#"
                :class="cn(
                  'flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl',
                  'font-display font-bold text-sm tracking-wider',
                  'bg-neon-purple text-primary-foreground',
                  'hover:bg-neon-purple/85 transition-all duration-300 touch-press',
                  'glow-purple clip-corner-sm',
                )"
              >
                <Zap class="w-4 h-4" aria-hidden="true" />
                Start Playing
              </a>
              <button
                type="button"
                :class="cn(
                  'flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl',
                  'font-display font-bold text-sm tracking-wider border touch-press',
                  'text-neon-mint border-neon-mint/40 hover:bg-neon-mint/10 transition-all duration-300',
                )"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
