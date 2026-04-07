<script setup lang="ts">
import { ref, computed } from 'vue'
import { Zap, Star, Trophy, Crown, TrendingUp, Swords } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  label: string
  labelEn: string
  icon: unknown
}

interface FeaturedGame {
  id: number
  title: string
  titleJp: string
  genre: string
  rating: number
  rank: number
  image: string
  description: string
  category: string[]
}

const categories: Category[] = [
  { id: 'trending',  label: '注目',       labelEn: 'Trending',  icon: TrendingUp },
  { id: 'top-rated', label: '高評価',     labelEn: 'Top Rated', icon: Star },
  { id: 'action',    label: 'アクション', labelEn: 'Action',    icon: Swords },
  { id: 'rpg',       label: 'RPG',        labelEn: 'RPG',       icon: Crown },
]

const featuredGames: FeaturedGame[] = [
  {
    id: 1, title: 'CYBER BLADE', titleJp: 'サイバーブレード', genre: 'Action RPG',
    rating: 4.9, rank: 1, image: '/images/game-1.jpg',
    description: 'The most immersive cyberpunk RPG of 2026. Master the dual-blade combat system.',
    category: ['trending', 'action'],
  },
  {
    id: 2, title: 'MECH ZERO', titleJp: 'メックゼロ', genre: 'Mecha Battle',
    rating: 4.7, rank: 2, image: '/images/game-2.jpg',
    description: 'Pilot colossal war machines through devastated cityscapes.',
    category: ['trending', 'action'],
  },
  {
    id: 3, title: 'SHADOW BLADE', titleJp: 'シャドウブレード', genre: 'Hack & Slash',
    rating: 4.8, rank: 3, image: '/images/game-3.jpg',
    description: 'Cherry blossoms and neon clash in this breathtaking ninja masterpiece.',
    category: ['top-rated', 'action'],
  },
  {
    id: 4, title: 'NEON EXODUS', titleJp: 'ネオンエクソダス', genre: 'JRPG',
    rating: 4.6, rank: 4, image: '/images/game-4.jpg',
    description: 'Embark on an epic journey across floating neon islands.',
    category: ['top-rated', 'rpg'],
  },
  {
    id: 5, title: 'GHOST PROTOCOL', titleJp: 'ゴーストプロトコル', genre: 'Strategy',
    rating: 4.5, rank: 5, image: '/images/game-5.jpg',
    description: 'Outsmart enemies across a glowing tactical battlefield.',
    category: ['top-rated', 'rpg'],
  },
]

const rankColors = [
  'text-amber-400', 'text-slate-300', 'text-amber-700',
  'text-muted-foreground', 'text-muted-foreground',
]
const rankIcons: (unknown | null)[] = [Crown, Trophy, Trophy, null, null]

const activeCategory = ref('trending')
const filtered = computed(() =>
  featuredGames.filter((g) => g.category.includes(activeCategory.value)),
)
</script>

<template>
  <section id="featured" class="py-16 sm:py-20 scroll-mt-20" aria-labelledby="featured-heading">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-8 px-4 sm:px-6">
        <div class="flex items-center justify-center gap-2 mb-3">
          <div class="h-[2px] w-8 bg-neon-mint rounded-full" aria-hidden="true" />
          <span class="text-xs font-body font-semibold text-neon-mint tracking-widest uppercase">注目タイトル</span>
          <div class="h-[2px] w-8 bg-neon-mint rounded-full" aria-hidden="true" />
        </div>
        <h2 id="featured-heading" class="font-display font-black text-3xl sm:text-4xl text-foreground">
          FEATURED <span class="text-neon-purple text-glow-purple">GAMES</span>
        </h2>
        <p class="mt-2 text-sm font-body text-muted-foreground">
          今週のピックアップ — Editor's picks this week
        </p>
      </div>

      <!-- Category tabs — horizontally scrollable on mobile with snap -->
      <div class="relative mb-8">
        <div
          class="flex items-center gap-2 overflow-x-auto hide-scrollbar px-4 sm:px-6 pb-1 sm:flex-wrap sm:justify-center"
          role="tablist"
          aria-label="Game categories"
        >
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            role="tab"
            :aria-selected="activeCategory === cat.id"
            :class="cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-300',
              'shrink-0 touch-press',
              activeCategory === cat.id
                ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50 glow-purple'
                : 'bg-surface-2 text-muted-foreground border border-border hover:text-foreground',
            )"
            @click="activeCategory = cat.id"
          >
            <component :is="cat.icon" class="w-4 h-4" aria-hidden="true" />
            {{ cat.label }}
            <span class="text-[10px] text-muted-foreground hidden sm:inline">{{ cat.labelEn }}</span>
          </button>
        </div>
        <!-- Right fade on mobile to hint more tabs -->
        <div class="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-background to-transparent pointer-events-none sm:hidden" aria-hidden="true" />
      </div>

      <!-- Games list -->
      <div role="tabpanel" :aria-label="`${activeCategory} games`" class="flex flex-col gap-3 sm:gap-4 px-4 sm:px-6">
        <article
          v-for="(game, i) in filtered"
          :key="game.id"
          :class="cn(
            'group flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border bg-surface-1',
            'transition-all duration-300 cursor-pointer touch-press',
            'active:scale-[0.99] active:bg-surface-2',
            'hover:border-neon-purple/40 hover:bg-surface-2 hover:glow-purple hover:-translate-y-0.5',
          )"
          :aria-label="`${game.title} ranked #${game.rank}`"
          :style="{ animationDelay: `${i * 0.05}s` }"
        >
          <!-- Rank -->
          <div class="flex items-center justify-center w-8 sm:w-10 shrink-0">
            <component
              v-if="rankIcons[game.rank - 1]"
              :is="rankIcons[game.rank - 1]"
              :class="cn('w-5 h-5 sm:w-6 sm:h-6', rankColors[game.rank - 1])"
              :aria-label="`Rank ${game.rank}`"
            />
            <span v-else :class="cn('font-display font-black text-lg sm:text-xl', rankColors[game.rank - 1])">
              {{ game.rank }}
            </span>
          </div>

          <!-- Thumbnail -->
          <div class="w-16 h-14 sm:w-24 sm:h-20 rounded-xl overflow-hidden shrink-0">
            <img
              :src="game.image"
              :alt="`${game.title} thumbnail`"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h3 class="font-display font-black text-sm sm:text-base text-foreground tracking-wide">{{ game.title }}</h3>
              <span class="text-[10px] sm:text-xs font-body text-neon-purple">{{ game.titleJp }}</span>
              <span class="hidden sm:inline text-xs font-body text-muted-foreground bg-surface-3 px-2 py-0.5 rounded-lg">{{ game.genre }}</span>
            </div>
            <p class="text-xs font-body text-muted-foreground mt-1 line-clamp-1 leading-relaxed hidden sm:block">
              {{ game.description }}
            </p>
            <!-- Mobile: show genre inline -->
            <span class="sm:hidden text-[10px] font-body text-muted-foreground bg-surface-3 px-2 py-0.5 rounded-md mt-1 inline-block">{{ game.genre }}</span>
          </div>

          <!-- Rating + CTA -->
          <div class="flex flex-col items-end justify-between shrink-0">
            <div class="flex items-center gap-1">
              <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden="true" />
              <span class="font-display font-bold text-xs sm:text-sm text-foreground">{{ game.rating }}</span>
            </div>
            <button
              type="button"
              :class="cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-display font-bold tracking-wider',
                'bg-neon-purple/20 text-neon-purple border border-neon-purple/30',
                'group-hover:bg-neon-purple group-hover:text-primary-foreground group-hover:border-neon-purple',
                'transition-all duration-300 touch-press',
              )"
              :aria-label="`Play ${game.title}`"
            >
              <Zap class="w-3 h-3" aria-hidden="true" />
              PLAY
            </button>
          </div>
        </article>
      </div>

      <!-- View all CTA -->
      <div class="text-center mt-8 sm:mt-10 px-4">
        <a
          href="#"
          :class="cn(
            'inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl w-full sm:w-auto justify-center',
            'font-display font-bold text-sm tracking-wider',
            'border border-neon-mint/40 text-neon-mint',
            'hover:bg-neon-mint/10 hover:border-neon-mint transition-all duration-300',
            'active:scale-95 touch-press',
          )"
        >
          すべて見る — View All Games
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
</template>
