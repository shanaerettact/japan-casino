<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  History,
  Search,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  Zap,
  Dices,
  Spade,
  Star,
  SlidersHorizontal,
  X,
  BarChart3,
  CircleDollarSign,
  Gamepad2,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const router = useRouter()

// ── filter state ────────────────────────────────────────────────────────────
type TimeFrame = '24h' | '7d' | '30d' | '60d' | '90d'

const timeFrames: { key: TimeFrame; label: string }[] = [
  { key: '24h', label: '24時間' },
  { key: '7d',  label: '7日間' },
  { key: '30d', label: '30日間' },
  { key: '60d', label: '60日間' },
  { key: '90d', label: '90日間' },
]

const selectedTime  = ref<TimeFrame>('7d')
const gameSearchQ   = ref('')
const selectedGame  = ref<string>('all')
const gameDropOpen  = ref(false)
const filtersOpen   = ref(false)

const gameOptions = [
  { id: 'all',      label: 'すべてのゲーム', icon: Gamepad2 },
  { id: 'baccarat', label: 'バカラ',          icon: Spade },
  { id: 'slots',    label: 'スロット',         icon: Zap },
  { id: 'roulette', label: 'ルーレット',        icon: Dices },
  { id: 'poker',    label: 'ポーカー',          icon: Star },
]

const filteredGameOptions = computed(() =>
  gameOptions.filter(g =>
    g.label.toLowerCase().includes(gameSearchQ.value.toLowerCase()) ||
    g.id.toLowerCase().includes(gameSearchQ.value.toLowerCase()),
  ),
)

function selectGame(id: string) {
  selectedGame.value = id
  gameDropOpen.value = false
  gameSearchQ.value  = ''
}

const selectedGameLabel = computed(
  () => gameOptions.find(g => g.id === selectedGame.value)?.label ?? 'すべてのゲーム',
)

// ── mock records ─────────────────────────────────────────────────────────────
interface GameRecord {
  id: string
  game: string
  gameId: 'baccarat' | 'slots' | 'roulette' | 'poker'
  date: string
  time: string
  bet: number
  result: 'win' | 'lose' | 'draw'
  payout: number
  roundId: string
}

const allRecords: GameRecord[] = [
  { id: '1',  game: 'バカラ',    gameId: 'baccarat', date: '2024-04-25', time: '22:14', bet: 5_000,  result: 'win',  payout: 9_750,  roundId: 'BCC-88142' },
  { id: '2',  game: 'スロット',  gameId: 'slots',    date: '2024-04-25', time: '21:55', bet: 1_000,  result: 'lose', payout: 0,      roundId: 'SLT-20934' },
  { id: '3',  game: 'ルーレット',gameId: 'roulette', date: '2024-04-25', time: '21:30', bet: 3_000,  result: 'win',  payout: 5_850,  roundId: 'RLT-55671' },
  { id: '4',  game: 'ポーカー',  gameId: 'poker',    date: '2024-04-24', time: '19:03', bet: 10_000, result: 'lose', payout: 0,      roundId: 'PKR-11028' },
  { id: '5',  game: 'バカラ',    gameId: 'baccarat', date: '2024-04-24', time: '18:47', bet: 8_000,  result: 'draw', payout: 8_000,  roundId: 'BCC-88099' },
  { id: '6',  game: 'スロット',  gameId: 'slots',    date: '2024-04-24', time: '17:22', bet: 500,    result: 'win',  payout: 2_500,  roundId: 'SLT-20891' },
  { id: '7',  game: 'バカラ',    gameId: 'baccarat', date: '2024-04-23', time: '23:05', bet: 5_000,  result: 'win',  payout: 9_750,  roundId: 'BCC-87944' },
  { id: '8',  game: 'ルーレット',gameId: 'roulette', date: '2024-04-23', time: '20:18', bet: 2_000,  result: 'lose', payout: 0,      roundId: 'RLT-55512' },
  { id: '9',  game: 'ポーカー',  gameId: 'poker',    date: '2024-04-22', time: '16:44', bet: 15_000, result: 'win',  payout: 29_250, roundId: 'PKR-10877' },
  { id: '10', game: 'スロット',  gameId: 'slots',    date: '2024-04-22', time: '14:30', bet: 1_000,  result: 'lose', payout: 0,      roundId: 'SLT-20755' },
  { id: '11', game: 'バカラ',    gameId: 'baccarat', date: '2024-04-21', time: '22:51', bet: 6_000,  result: 'win',  payout: 11_700, roundId: 'BCC-87800' },
  { id: '12', game: 'ルーレット',gameId: 'roulette', date: '2024-04-20', time: '19:09', bet: 4_000,  result: 'lose', payout: 0,      roundId: 'RLT-55300' },
]

const timeRangeDays: Record<TimeFrame, number> = {
  '24h': 1, '7d': 7, '30d': 30, '60d': 60, '90d': 90,
}

const filteredRecords = computed(() => {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - timeRangeDays[selectedTime.value])

  return allRecords.filter(r => {
    const d = new Date(r.date)
    if (d < cutoff) return false
    if (selectedGame.value !== 'all' && r.gameId !== selectedGame.value) return false
    return true
  })
})

// ── summary stats ────────────────────────────────────────────────────────────
const stats = computed(() => {
  const records = filteredRecords.value
  const totalBet  = records.reduce((s, r) => s + r.bet, 0)
  const totalPay  = records.reduce((s, r) => s + r.payout, 0)
  const netPnL    = totalPay - totalBet
  const wins      = records.filter(r => r.result === 'win').length
  const winRate   = records.length ? Math.round((wins / records.length) * 100) : 0
  return { totalBet, totalPay, netPnL, totalGames: records.length, wins, winRate }
})

// ── helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString('ja-JP') }

const resultConfig = {
  win:  { label: '勝利', icon: TrendingUp,   cls: 'text-neon-mint',  bg: 'bg-neon-mint/10',  border: 'border-neon-mint/25' },
  lose: { label: '敗北', icon: TrendingDown,  cls: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/25' },
  draw: { label: '引分', icon: Minus,         cls: 'text-yellow-400',  bg: 'bg-yellow-400/10',  border: 'border-yellow-400/25' },
}

const gameIconMap: Record<string, unknown> = {
  baccarat: Spade,
  slots:    Zap,
  roulette: Dices,
  poker:    Star,
}

// Group records by date for section headers
const groupedRecords = computed(() => {
  const groups: { date: string; records: GameRecord[] }[] = []
  const seen: Record<string, number> = {}
  for (const r of filteredRecords.value) {
    if (seen[r.date] === undefined) {
      seen[r.date] = groups.length
      groups.push({ date: r.date, records: [] })
    }
    groups[seen[r.date]].records.push(r)
  }
  return groups
})

function formatDate(d: string) {
  const dt = new Date(d)
  return dt.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })
}
</script>

<template>
  <main
    class="min-h-screen bg-background pt-20 pb-28 md:pb-16 relative overflow-x-hidden"
    aria-label="ゲーム記録"
  >
    <!-- ambient glow -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-neon-mint/[0.05] blur-[120px]" />
      <div class="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-neon-purple/[0.06] blur-[100px]" />
      <div class="absolute bottom-0 left-1/3 w-[360px] h-[360px] rounded-full bg-neon-mint/[0.04] blur-[140px]" />
    </div>

    <div class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 space-y-5">

      <!-- ── page header ─────────────────────────────────────────────────── -->
      <div class="flex items-center gap-3 sm:gap-4 animate-slide-left">
        <button
          type="button"
          aria-label="前のページに戻る"
          class="group flex items-center justify-center size-10 sm:size-11 rounded-xl border border-border/70 bg-surface-2/60 backdrop-blur-md hover:border-neon-mint/50 hover:bg-neon-mint/10 transition-all duration-300 touch-press shrink-0"
          @click="router.back()"
        >
          <ArrowLeft class="w-4 h-4 text-muted-foreground group-hover:text-neon-mint transition-colors duration-300" aria-hidden="true" />
        </button>

        <div class="flex items-center gap-3 min-w-0 flex-1">
          <div
            class="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-neon-mint/12 ring-1 ring-neon-mint/30 glow-mint shrink-0"
            aria-hidden="true"
          >
            <History class="w-5 h-5 text-neon-mint" aria-hidden="true" />
          </div>
          <div class="min-w-0">
            <h1 class="font-display text-xl sm:text-2xl font-black tracking-[0.12em] text-foreground text-glow-mint leading-none">
              ゲーム記録
            </h1>
            <p class="font-body text-[11px] sm:text-xs text-muted-foreground mt-0.5 tracking-wide">GAME RECORDS</p>
          </div>
        </div>

        <!-- filter toggle (mobile) -->
        <button
          type="button"
          class="sm:hidden flex items-center justify-center size-10 rounded-xl border transition-all duration-300 touch-press shrink-0"
          :class="filtersOpen
            ? 'border-neon-mint/50 bg-neon-mint/10 text-neon-mint'
            : 'border-border/70 bg-surface-2/60 text-muted-foreground'"
          :aria-label="filtersOpen ? 'フィルターを閉じる' : 'フィルターを開く'"
          :aria-expanded="filtersOpen"
          @click="filtersOpen = !filtersOpen"
        >
          <Transition name="fade-icon" mode="out-in">
            <X v-if="filtersOpen" key="close" class="w-4 h-4" aria-hidden="true" />
            <SlidersHorizontal v-else key="open" class="w-4 h-4" aria-hidden="true" />
          </Transition>
        </button>
      </div>

      <!-- ── summary stats ───────────────────────────────────────────────── -->
      <div
        class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 animate-fade-up"
        aria-label="集計サマリー"
      >
        <div
          v-for="card in [
            { label: '総ゲーム数', value: stats.totalGames, unit: '回', icon: Gamepad2, color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/20' },
            { label: '総ベット',   value: fmt(stats.totalBet), unit: 'pt', icon: CircleDollarSign, color: 'text-yellow-400', bg: 'bg-yellow-400/8', border: 'border-yellow-400/20' },
            { label: '勝率',      value: stats.winRate + '%', unit: '', icon: Trophy, color: 'text-neon-mint', bg: 'bg-neon-mint/10', border: 'border-neon-mint/20' },
            {
              label: '純損益',
              value: (stats.netPnL >= 0 ? '+' : '') + fmt(stats.netPnL),
              unit: 'pt',
              icon: BarChart3,
              color: stats.netPnL >= 0 ? 'text-neon-mint' : 'text-destructive',
              bg:    stats.netPnL >= 0 ? 'bg-neon-mint/10' : 'bg-destructive/10',
              border:stats.netPnL >= 0 ? 'border-neon-mint/20' : 'border-destructive/20',
            },
          ]"
          :key="card.label"
          :class="cn(
            'relative flex flex-col gap-2 rounded-2xl border bg-surface-1/70 backdrop-blur-md p-3.5 sm:p-4 overflow-hidden',
            card.border,
          )"
        >
          <div :class="cn('flex items-center justify-center size-8 rounded-xl border shrink-0', card.bg, card.border)">
            <component :is="card.icon" :class="cn('w-4 h-4', card.color)" aria-hidden="true" />
          </div>
          <div>
            <p class="font-display text-lg sm:text-xl font-black text-foreground tabular-nums leading-none">
              {{ card.value }}<span class="text-[10px] font-body text-muted-foreground ml-0.5">{{ card.unit }}</span>
            </p>
            <p class="font-body text-[10px] text-muted-foreground mt-1 tracking-wide">{{ card.label }}</p>
          </div>
          <!-- subtle top accent line -->
          <div
            :class="cn('absolute top-0 left-3 right-3 h-[1.5px] rounded-full opacity-60', card.color.replace('text-', 'bg-'))"
            aria-hidden="true"
          />
        </div>
      </div>

      <!-- ── filters ─────────────────────────────────────────────────────── -->
      <Transition name="slide-filters">
        <section
          v-show="filtersOpen || true"
          class="rounded-2xl border border-border/50 bg-surface-1/70 backdrop-blur-md overflow-hidden animate-fade-up delay-100"
          aria-label="フィルター"
        >
          <div class="p-4 sm:p-5 space-y-4">

            <!-- time frame pills -->
            <div>
              <p class="font-display text-[9px] font-black tracking-[0.25em] text-muted-foreground mb-2.5 uppercase">
                期間
              </p>
              <div
                class="flex gap-2 flex-wrap"
                role="group"
                aria-label="期間フィルター"
              >
                <button
                  v-for="tf in timeFrames"
                  :key="tf.key"
                  type="button"
                  :class="cn(
                    'relative h-8 px-3.5 rounded-xl font-display text-xs font-black tracking-wide transition-all duration-200 touch-press border',
                    selectedTime === tf.key
                      ? 'bg-neon-mint/15 border-neon-mint/40 text-neon-mint glow-mint'
                      : 'bg-surface-2/60 border-border/50 text-muted-foreground hover:border-neon-mint/30 hover:text-foreground hover:bg-surface-2',
                  )"
                  :aria-pressed="selectedTime === tf.key"
                  @click="selectedTime = tf.key"
                >
                  {{ tf.label }}
                  <!-- active indicator dot -->
                  <span
                    v-if="selectedTime === tf.key"
                    class="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-neon-mint animate-neon-pulse"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <!-- game dropdown -->
            <div>
              <p class="font-display text-[9px] font-black tracking-[0.25em] text-muted-foreground mb-2.5 uppercase">
                ゲーム
              </p>
              <div class="relative">
                <button
                  type="button"
                  class="flex w-full items-center justify-between gap-2 h-10 px-3.5 rounded-xl border border-border/60 bg-surface-2/60 backdrop-blur-sm hover:border-neon-mint/40 hover:bg-surface-2/80 transition-all duration-200 touch-press"
                  :aria-expanded="gameDropOpen"
                  aria-haspopup="listbox"
                  aria-label="ゲームを選択"
                  @click="gameDropOpen = !gameDropOpen"
                >
                  <span class="font-body text-sm font-medium text-foreground truncate">{{ selectedGameLabel }}</span>
                  <ChevronDown
                    :class="cn('w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0', gameDropOpen && 'rotate-180')"
                    aria-hidden="true"
                  />
                </button>

                <!-- dropdown panel -->
                <Transition name="dropdown">
                  <div
                    v-if="gameDropOpen"
                    class="absolute top-[calc(100%+6px)] left-0 right-0 z-30 rounded-2xl border border-border/70 bg-surface-1/95 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] overflow-hidden"
                    role="listbox"
                    aria-label="ゲームリスト"
                  >
                    <!-- search inside dropdown -->
                    <div class="p-2 border-b border-border/40">
                      <div class="relative">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" aria-hidden="true" />
                        <input
                          v-model="gameSearchQ"
                          type="search"
                          placeholder="ゲームを検索..."
                          class="w-full h-8 pl-8 pr-3 rounded-xl bg-surface-2/80 border border-border/50 font-body text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-mint/40 transition-colors"
                          aria-label="ゲーム検索"
                        />
                      </div>
                    </div>
                    <ul class="py-1 max-h-48 overflow-y-auto">
                      <li
                        v-for="g in filteredGameOptions"
                        :key="g.id"
                        role="option"
                        :aria-selected="selectedGame === g.id"
                      >
                        <button
                          type="button"
                          :class="cn(
                            'w-full flex items-center gap-2.5 px-3 py-2.5 font-body text-sm transition-all duration-150 touch-press text-left',
                            selectedGame === g.id
                              ? 'text-neon-mint bg-neon-mint/10'
                              : 'text-foreground hover:bg-surface-2/60 hover:text-neon-mint',
                          )"
                          @click="selectGame(g.id)"
                        >
                          <component :is="g.icon" class="w-4 h-4 text-neon-purple shrink-0" aria-hidden="true" />
                          {{ g.label }}
                          <span
                            v-if="selectedGame === g.id"
                            class="ml-auto w-1.5 h-1.5 rounded-full bg-neon-mint shrink-0"
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                      <li v-if="filteredGameOptions.length === 0" class="px-3 py-4 text-center font-body text-xs text-muted-foreground">
                        ゲームが見つかりません
                      </li>
                    </ul>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </section>
      </Transition>

      <!-- ── records list ─────────────────────────────────────────────────── -->
      <section aria-label="ベット詳細" class="space-y-4 animate-fade-up delay-200">
        <h2 class="font-display text-[10px] font-black tracking-[0.25em] text-muted-foreground px-1 uppercase">
          ベット詳細 &mdash; {{ filteredRecords.length }} 件
        </h2>

        <!-- empty state -->
        <Transition name="fade-icon">
          <div
            v-if="filteredRecords.length === 0"
            class="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl border border-border/40 bg-surface-1/60 backdrop-blur-md text-center"
          >
            <div class="flex items-center justify-center size-16 rounded-2xl bg-surface-2/60 border border-border/50">
              <History class="w-7 h-7 text-muted-foreground/40" aria-hidden="true" />
            </div>
            <div>
              <p class="font-display text-sm font-black text-foreground tracking-wide">記録がありません</p>
              <p class="font-body text-xs text-muted-foreground mt-1">選択した期間にゲーム記録は見つかりませんでした</p>
            </div>
          </div>
        </Transition>

        <!-- date groups -->
        <template v-if="filteredRecords.length > 0">
          <div
            v-for="group in groupedRecords"
            :key="group.date"
            class="space-y-2"
          >
            <!-- date header -->
            <div class="flex items-center gap-3 px-1">
              <span class="font-body text-[11px] font-semibold text-muted-foreground">
                {{ formatDate(group.date) }}
              </span>
              <div class="flex-1 h-px bg-border/40" aria-hidden="true" />
              <span class="font-mono text-[10px] text-muted-foreground/50">
                {{ group.records.length }}件
              </span>
            </div>

            <!-- record cards -->
            <div class="rounded-2xl border border-border/50 bg-surface-1/60 backdrop-blur-md overflow-hidden">
              <ul role="list" class="divide-y divide-border/30">
                <li
                  v-for="record in group.records"
                  :key="record.id"
                  class="group relative flex items-center gap-3 sm:gap-4 px-4 py-3.5 sm:py-4 hover:bg-surface-2/40 transition-all duration-200"
                >
                  <!-- game icon tile -->
                  <div
                    class="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-neon-purple/10 border border-neon-purple/20 shrink-0 group-hover:bg-neon-purple/18 transition-colors duration-200"
                    aria-hidden="true"
                  >
                    <component
                      :is="gameIconMap[record.gameId]"
                      class="w-5 h-5 text-neon-purple"
                      aria-hidden="true"
                    />
                  </div>

                  <!-- main info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="font-body text-sm font-semibold text-foreground truncate">
                        {{ record.game }}
                      </span>
                      <!-- result badge -->
                      <span
                        :class="cn(
                          'flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-lg border text-[10px] font-display font-black tracking-wide',
                          resultConfig[record.result].bg,
                          resultConfig[record.result].border,
                          resultConfig[record.result].cls,
                        )"
                        :aria-label="`結果: ${resultConfig[record.result].label}`"
                      >
                        <component :is="resultConfig[record.result].icon" class="w-3 h-3" aria-hidden="true" />
                        {{ resultConfig[record.result].label }}
                      </span>
                    </div>

                    <!-- round ID + time -->
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="font-mono text-[10px] text-muted-foreground/60 truncate">{{ record.roundId }}</span>
                      <span class="text-muted-foreground/30 text-[10px]" aria-hidden="true">·</span>
                      <span class="font-mono text-[10px] text-muted-foreground/60 shrink-0">{{ record.time }}</span>
                    </div>
                  </div>

                  <!-- bet / payout amounts -->
                  <div class="flex flex-col items-end gap-1 shrink-0">
                    <div class="flex items-center gap-1">
                      <span class="font-body text-[9px] text-muted-foreground/60">BET</span>
                      <span class="font-display text-xs font-black text-foreground tabular-nums">
                        {{ fmt(record.bet) }}
                      </span>
                      <span class="font-body text-[9px] text-muted-foreground/60">pt</span>
                    </div>
                    <div
                      v-if="record.result !== 'lose'"
                      class="flex items-center gap-1"
                    >
                      <span class="font-body text-[9px] text-muted-foreground/60">払戻</span>
                      <span
                        :class="cn(
                          'font-display text-xs font-black tabular-nums',
                          record.result === 'win' ? 'text-neon-mint' : 'text-yellow-400',
                        )"
                      >
                        +{{ fmt(record.payout) }}
                      </span>
                      <span class="font-body text-[9px] text-muted-foreground/60">pt</span>
                    </div>
                    <div v-else class="flex items-center gap-1">
                      <span class="font-display text-xs font-black text-destructive tabular-nums">
                        -{{ fmt(record.bet) }}
                      </span>
                      <span class="font-body text-[9px] text-muted-foreground/60">pt</span>
                    </div>
                  </div>

                  <!-- left accent bar on hover -->
                  <span
                    :class="cn(
                      'absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                      record.result === 'win'  ? 'bg-neon-mint' :
                      record.result === 'draw' ? 'bg-yellow-400' : 'bg-destructive',
                    )"
                    aria-hidden="true"
                  />
                </li>
              </ul>
            </div>
          </div>
        </template>
      </section>
    </div>

    <!-- close game dropdown on outside click -->
    <div
      v-if="gameDropOpen"
      class="fixed inset-0 z-20"
      aria-hidden="true"
      @click="gameDropOpen = false"
    />
  </main>
</template>

<style scoped>
.slide-filters-enter-active,
.slide-filters-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.26, 0.64, 1), max-height 0.3s ease;
}
.slide-filters-enter-from,
.slide-filters-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

.fade-icon-enter-active,
.fade-icon-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-icon-enter-from,
.fade-icon-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
