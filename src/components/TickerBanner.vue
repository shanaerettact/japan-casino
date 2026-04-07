<script setup lang="ts">
import { Zap } from 'lucide-vue-next'

const tickers: string[] = [
  '新作ゲーム「CYBER BLADE」本日リリース！',
  '全国ランキング更新中 — Season 12',
  '期間限定イベント「NEON WARS」開催中！',
  'プレミアム会員限定スキン配布中',
  '人気No.1「GHOST PROTOCOL」— 50%オフ',
  "NEW GAME 'CYBER BLADE' OUT NOW!",
  'GLOBAL RANKINGS UPDATED — Season 12',
  "LIMITED EVENT 'NEON WARS' IS LIVE!",
]

// Double items so the CSS loop is seamless
const doubled = [...tickers, ...tickers]
</script>

<template>
  <div
    class="w-full overflow-hidden bg-neon-purple/15 border-y border-neon-purple/25 py-2"
    role="marquee"
    aria-label="Latest news ticker"
  >
    <div class="flex whitespace-nowrap animate-ticker gap-0">
      <span
        v-for="(item, i) in doubled"
        :key="i"
        class="inline-flex items-center gap-2 px-8 text-sm font-body text-foreground/80"
      >
        <Zap class="w-3.5 h-3.5 text-neon-mint shrink-0" aria-hidden="true" />
        {{ item }}
      </span>
    </div>
  </div>
</template>
