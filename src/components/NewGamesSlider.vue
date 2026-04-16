<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import GameCard, { type Game } from '@/components/GameCard.vue'

const games: Game[] = [
  {
    id: 1,
    title: 'CYBER BLADE',
    titleJp: 'サイバーブレード',
    genre: 'Action RPG',
    rating: 4.9,
    players: '820K',
    releaseDate: '2026.03.19',
    tag: 'NEW',
    tagColor: 'mint',
    image: '/images/game-1.jpg',
    description: '刃を持て、電脳都市を駆け抜けろ。',
  },
  {
    id: 2,
    title: 'MECH ZERO',
    titleJp: 'メックゼロ',
    genre: 'Mecha Battle',
    rating: 4.7,
    players: '1.2M',
    releaseDate: '2026.02.14',
    tag: 'HOT',
    tagColor: 'purple',
    image: '/images/game-2.jpg',
    description: '巨大メカを操り、世界の命運を握れ。',
  },
  {
    id: 3,
    title: 'SHADOW BLADE',
    titleJp: 'シャドウブレード',
    genre: 'Hack & Slash',
    rating: 4.8,
    players: '650K',
    releaseDate: '2026.01.30',
    tag: 'NEW',
    tagColor: 'mint',
    image: '/images/game-3.jpg',
    description: '桜と闇の間で、忍びの剣が舞う。',
  },
  {
    id: 4,
    title: 'NEON EXODUS',
    titleJp: 'ネオンエクソダス',
    genre: 'JRPG',
    rating: 4.6,
    players: '990K',
    releaseDate: '2025.12.10',
    tag: 'UPDATE',
    tagColor: 'amber',
    image: '/images/game-4.jpg',
    description: 'ネオン輝く天空島で、伝説の勇者となれ。',
  },
  {
    id: 5,
    title: 'GHOST PROTOCOL',
    titleJp: 'ゴーストプロトコル',
    genre: 'Strategy',
    rating: 4.5,
    players: '430K',
    releaseDate: '2025.11.22',
    tag: 'FREE',
    tagColor: 'sky',
    image: '/images/game-5.jpg',
    description: '電脳戦場を制する戦術の天才になれ。',
  },
]

const scrollRef       = ref<HTMLDivElement | null>(null)
const canScrollLeft   = ref(false)
const canScrollRight  = ref(true)
const activeIndex     = ref(0)
const isScrolling     = ref(false)

function updateScrollState() {
  const el = scrollRef.value
  if (!el) return
  canScrollLeft.value  = el.scrollLeft > 10
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 10

  
  const cardWidth = el.querySelector('article')?.offsetWidth ?? 304
  const gap       = 20
  activeIndex.value = Math.round(el.scrollLeft / (cardWidth + gap))
}

function scroll(dir: 'left' | 'right') {
  const el = scrollRef.value
  if (!el) return
  const cardWidth = el.querySelector('article')?.offsetWidth ?? 304
  el.scrollBy({ left: dir === 'left' ? -(cardWidth + 20) : (cardWidth + 20), behavior: 'smooth' })
  setTimeout(updateScrollState, 400)
}

function scrollToIndex(i: number) {
  const el = scrollRef.value
  if (!el) return
  const cards = el.querySelectorAll('article')
  const card  = cards[i] as HTMLElement | undefined
  if (!card) return
  el.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' })
  setTimeout(updateScrollState, 400)
}


let scrollTimer: ReturnType<typeof setTimeout>
function onScroll() {
  isScrolling.value = true
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => { isScrolling.value = false }, 150)
  updateScrollState()
}

onMounted(updateScrollState)
onUnmounted(() => clearTimeout(scrollTimer))
</script>

<template>
  <section
    id="games"
    class="py-16 sm:py-20 scroll-mt-20"
    aria-labelledby="new-games-heading"
  >
    
    <div class="flex items-end justify-between mb-8 px-4 sm:px-6 max-w-7xl mx-auto">
      <div>
        <div class="flex items-center gap-2 mb-3">
          <div class="h-[2px] w-8 bg-neon-purple rounded-full" aria-hidden="true" />
          <span class="text-xs font-body font-semibold text-neon-purple tracking-widest uppercase">新着ゲーム</span>
        </div>
        <h2
          id="new-games-heading"
          class="font-display font-black text-3xl sm:text-4xl text-foreground text-balance leading-tight"
        >
          NEW <span class="text-neon-mint text-glow-mint">GAMES</span>
        </h2>
        <p class="mt-2 text-sm font-body text-muted-foreground">
          最新リリースをチェック — Fresh from the digital forge
        </p>
      </div>

      
      <div class="hidden sm:flex items-center gap-2" role="group" aria-label="Slider navigation">
        <button
          type="button"
          :disabled="!canScrollLeft"
          aria-label="Scroll left"
          :class="cn(
            'w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 touch-press',
            canScrollLeft
              ? 'border-neon-purple/50 text-neon-purple hover:bg-neon-purple/15 hover:glow-purple'
              : 'border-border text-muted-foreground opacity-40 cursor-not-allowed',
          )"
          @click="scroll('left')"
        >
          <ChevronLeft class="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          :disabled="!canScrollRight"
          aria-label="Scroll right"
          :class="cn(
            'w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 touch-press',
            canScrollRight
              ? 'border-neon-mint/50 text-neon-mint hover:bg-neon-mint/15'
              : 'border-border text-muted-foreground opacity-40 cursor-not-allowed',
          )"
          @click="scroll('right')"
        >
          <ChevronRight class="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>

    
    <div class="relative">
      
      <div
        :class="cn(
          'absolute left-0 top-0 bottom-4 w-12 sm:w-16 z-10 pointer-events-none transition-opacity duration-300',
          'bg-linear-to-r from-background to-transparent',
          canScrollLeft ? 'opacity-100' : 'opacity-0',
        )"
        aria-hidden="true"
      />

      
      <div
        ref="scrollRef"
        class="flex gap-4 sm:gap-5 overflow-x-auto pb-4 px-4 sm:px-6 hide-scrollbar snap-x-mandatory sm:[scroll-snap-type:none]"
        style="-webkit-overflow-scrolling: touch;"
        role="list"
        aria-label="New games list"
        @scroll="onScroll"
      >
        
        <div class="w-0 sm:hidden shrink-0" aria-hidden="true" />

        <div
          v-for="(game, i) in games"
          :key="game.id"
          role="listitem"
          class="snap-start sm:[scroll-snap-align:none] shrink-0"
        >
          <GameCard :game="game" :index="i" />
        </div>

        
        <div class="w-4 sm:hidden shrink-0" aria-hidden="true" />
      </div>

      
      <div
        :class="cn(
          'absolute right-0 top-0 bottom-4 w-16 sm:w-24 z-10 pointer-events-none transition-opacity duration-300',
          'bg-linear-to-l from-background to-transparent',
          canScrollRight ? 'opacity-100' : 'opacity-0',
        )"
        aria-hidden="true"
      />
    </div>

    
    <div class="flex sm:hidden items-center justify-center gap-3 mt-4 px-4" role="group" aria-label="Slider navigation">
      
      <button
        type="button"
        :disabled="!canScrollLeft"
        aria-label="Previous game"
        :class="cn(
          'w-9 h-9 rounded-xl flex items-center justify-center border touch-press transition-all duration-200',
          canScrollLeft
            ? 'border-neon-purple/50 text-neon-purple active:bg-neon-purple/15'
            : 'border-border text-muted-foreground opacity-40',
        )"
        @click="scroll('left')"
      >
        <ChevronLeft class="w-4 h-4" aria-hidden="true" />
      </button>

      
      <div class="flex items-center gap-1.5" role="tablist" aria-label="Go to slide">
        <button
          v-for="(_, i) in games"
          :key="i"
          type="button"
          role="tab"
          :aria-selected="activeIndex === i"
          :aria-label="`Go to ${games[i].title}`"
          :class="cn(
            'rounded-full transition-all duration-300 touch-target',
            activeIndex === i
              ? 'w-6 h-2 bg-neon-purple glow-purple'
              : 'w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground/70',
          )"
          @click="scrollToIndex(i)"
        />
      </div>

      
      <button
        type="button"
        :disabled="!canScrollRight"
        aria-label="Next game"
        :class="cn(
          'w-9 h-9 rounded-xl flex items-center justify-center border touch-press transition-all duration-200',
          canScrollRight
            ? 'border-neon-mint/50 text-neon-mint active:bg-neon-mint/15'
            : 'border-border text-muted-foreground opacity-40',
        )"
        @click="scroll('right')"
      >
        <ChevronRight class="w-4 h-4" aria-hidden="true" />
      </button>
    </div>

    
    <p class="sm:hidden text-center text-xs font-body text-muted-foreground/50 mt-3 tracking-widest" aria-hidden="true">
      スワイプ → SWIPE
    </p>
  </section>
</template>
