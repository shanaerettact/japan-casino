<script setup lang="ts">
import { Trophy, Zap, TrendingUp } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Player {
  rank: number
  name: string
  handle: string
  score: string
  avatar: string
}

const topPlayers: Player[] = [
  { rank: 1, name: 'AkiraZero',   handle: '@akira_z', score: '98,420', avatar: 'AZ' },
  { rank: 2, name: 'MiraiHoshi',  handle: '@mirai_h', score: '94,110', avatar: 'MH' },
  { rank: 3, name: 'NightCrawler', handle: '@nght_cr', score: '89,750', avatar: 'NC' },
]

function avatarClass(rank: number): string {
  return cn(
    'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-display font-black',
    rank === 1 ? 'bg-neon-purple/20 text-neon-purple'
    : rank === 2 ? 'bg-neon-mint/20 text-neon-mint'
    : 'bg-amber-400/20 text-amber-400',
  )
}

function scoreClass(rank: number): string {
  return cn(
    'font-display font-black text-xl',
    rank === 1 ? 'text-neon-purple text-glow-purple'
    : rank === 2 ? 'text-neon-mint text-glow-mint'
    : 'text-amber-400',
  )
}

function badgeClass(rank: number): string {
  return cn(
    'px-2 py-0.5 rounded-lg text-xs font-display font-bold',
    rank === 1 ? 'bg-neon-purple/20 text-neon-purple'
    : rank === 2 ? 'bg-neon-mint/20 text-neon-mint'
    : 'bg-amber-400/20 text-amber-400',
  )
}
</script>

<template>
  <section id="rankings" class="py-16 px-4 sm:px-6 scroll-mt-20" aria-labelledby="rankings-heading">
    <div class="max-w-7xl mx-auto">
      <div
        :class="cn(
          'relative overflow-hidden rounded-3xl border border-neon-purple/30',
          'bg-linear-to-br from-surface-1 via-surface-2 to-surface-1',
          'p-8 sm:p-10',
        )"
      >
        <!-- Background glow orbs -->
        <div class="absolute top-0 left-0 w-72 h-72 rounded-full bg-neon-purple/10 blur-3xl -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
        <div class="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-neon-mint/8 blur-3xl translate-x-1/2 translate-y-1/2" aria-hidden="true" />
        <!-- Grid pattern -->
        <div
          class="absolute inset-0 opacity-[0.03]"
          style="
            background-image:
              linear-gradient(oklch(0.62 0.28 305) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.62 0.28 305) 1px, transparent 1px);
            background-size: 40px 40px;
          "
          aria-hidden="true"
        />

        <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-10">
          <!-- Left: heading -->
          <div class="lg:w-64 shrink-0">
            <div class="flex items-center gap-2 mb-3">
              <Trophy class="w-5 h-5 text-amber-400" aria-hidden="true" />
              <span class="text-xs font-body font-semibold text-amber-400 tracking-widest uppercase">Weekly Rankings</span>
            </div>
            <h2 id="rankings-heading" class="font-display font-black text-2xl sm:text-3xl text-foreground">
              TOP <span class="text-neon-purple text-glow-purple">PLAYERS</span>
            </h2>
            <p class="mt-2 text-sm font-body text-muted-foreground leading-relaxed">
              今週の精鋭プレイヤー — Compete to claim your spot on the global leaderboard.
            </p>
            <a
              href="#"
              class="mt-4 inline-flex items-center gap-2 text-sm font-display font-bold text-neon-mint hover:text-foreground transition-colors duration-200"
            >
              <TrendingUp class="w-4 h-4" aria-hidden="true" />
              Full Leaderboard →
            </a>
          </div>

          <!-- Right: player cards -->
          <div class="flex-1 w-full flex flex-col sm:flex-row gap-4">
            <article
              v-for="player in topPlayers"
              :key="player.rank"
              :class="cn(
                'flex-1 p-5 rounded-2xl border bg-surface-1 transition-all duration-300',
                player.rank === 1 ? 'border-neon-purple/50 glow-purple' : 'border-border hover:border-border/60',
              )"
              :aria-label="`Rank ${player.rank}: ${player.name}`"
            >
              <!-- Rank + avatar -->
              <div class="flex items-center gap-3 mb-3">
                <div :class="avatarClass(player.rank)" aria-hidden="true">{{ player.avatar }}</div>
                <div>
                  <div class="text-sm font-display font-bold text-foreground">{{ player.name }}</div>
                  <div class="text-xs font-body text-muted-foreground">{{ player.handle }}</div>
                </div>
                <Trophy
                  v-if="player.rank === 1"
                  class="ml-auto w-5 h-5 text-amber-400"
                  aria-label="Champion"
                />
              </div>

              <!-- Score -->
              <div class="pt-3 border-t border-border">
                <div class="text-xs font-body text-muted-foreground mb-1">Score</div>
                <div :class="scoreClass(player.rank)">{{ player.score }}</div>
              </div>

              <!-- Rank badge + action -->
              <div class="flex items-center justify-between mt-3">
                <span :class="badgeClass(player.rank)">#{{ player.rank }}</span>
                <button
                  type="button"
                  class="text-xs font-body text-muted-foreground hover:text-neon-purple transition-colors"
                  :aria-label="`View ${player.name}'s profile`"
                >
                  <Zap class="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
