<script setup lang="ts">
import { ref, computed, watch, inject, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  History,
  Search,
  ChevronDown,
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
  LayoutList,
  ChartColumnIncreasing,
  CalendarRange,
} from 'lucide-vue-next'
import { ja } from 'date-fns/locale'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { cn } from '@/lib/utils'
import { ThemeKey } from '@/composables/useTheme'

type RangePickerExpose = {
  openMenu: () => void
  closeMenu: () => void
  clearValue: () => void
}

const rangePickerRef = ref<RangePickerExpose | null>(null)
const reportRangePickerRef = ref<RangePickerExpose | null>(null)
const rangeFocusStart = ref(true)
const rangeMenuOpen = ref(false)
const rangeDraft = ref<Date[] | null>(null)

function parseInternalRange(val: unknown): Date[] | null {
  if (val == null) return null
  if (Array.isArray(val)) {
    const dates = val.filter((x): x is Date => x instanceof Date)
    return dates.length ? dates : null
  }
  if (val instanceof Date) return [val]
  return null
}

function onRangeInternalChange(val: unknown) {
  rangeDraft.value = parseInternalRange(val)
}

function onRangeMenuOpen() {
  gameDropOpen.value = false
  rangeMenuOpen.value = true
  if (customRangeModel.value && customRangeModel.value.length) {
    rangeDraft.value = [...customRangeModel.value]
  } else {
    rangeDraft.value = null
  }
}

function onRangeMenuClosed() {
  rangeMenuOpen.value = false
  rangeDraft.value = null
}

function onRangePickerRangeStart() {
  rangeFocusStart.value = false
}

function openRangeFromStart() {
  rangeFocusStart.value = true
  nextTick(() => {
    const p = recordsTab.value === 'report' ? reportRangePickerRef.value : rangePickerRef.value
    p?.openMenu()
  })
}

function openRangeFromEnd() {
  rangeFocusStart.value = false
  nextTick(() => {
    const p = recordsTab.value === 'report' ? reportRangePickerRef.value : rangePickerRef.value
    p?.openMenu()
  })
}

function onCustomRangeModelUpdate(_val: Date[] | null) {
  nextTick(() => {
    rangePickerRef.value?.closeMenu()
    reportRangePickerRef.value?.closeMenu()
  })
}

function clearRangeTrigger(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  customRangeModel.value = null
  rangeDraft.value = null
  rangePickerRef.value?.clearValue()
  reportRangePickerRef.value?.clearValue()
}

const rangeDisplay = computed(() => {
  if (rangeMenuOpen.value && rangeDraft.value !== null && rangeDraft.value.length > 0) {
    return rangeDraft.value
  }
  if (customRangeModel.value?.length) return customRangeModel.value
  return null
})

function fmtRangeCell(d: Date | undefined) {
  if (!d) return ''
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(d)
}

const rangeStartLabel = computed(() => {
  const a = rangeDisplay.value?.[0]
  return a instanceof Date ? fmtRangeCell(a) : ''
})

const rangeEndLabel = computed(() => {
  const row = rangeDisplay.value
  if (!row?.length) return ''
  const a = row[0]
  const b = row[1]
  if (rangeMenuOpen.value) {
    return b instanceof Date ? fmtRangeCell(b) : ''
  }
  if (a instanceof Date && b instanceof Date) return fmtRangeCell(b)
  if (a instanceof Date) return fmtRangeCell(a)
  return ''
})

const startBoxActive = computed(() => rangeMenuOpen.value && rangeFocusStart.value)
const endBoxActive = computed(() => rangeMenuOpen.value && !rangeFocusStart.value)

const datePickerActionRow = {
  showSelect: true,
  showCancel: true,
  showPreview: true,
  showNow: false,
  selectBtnLabel: '套用',
  cancelBtnLabel: '取消',
} as const

const router = useRouter()
const themeCtx = inject(ThemeKey, null)

type TimeFrame = 'yesterday' | 'today' | 'last_week' | 'this_week' | 'this_month'

const timeFrames: { key: TimeFrame; label: string }[] = [
  { key: 'yesterday', label: '昨天' },
  { key: 'today', label: '今天' },
  { key: 'last_week', label: '上周' },
  { key: 'this_week', label: '本周' },
  { key: 'this_month', label: '本月' },
]

const selectedTime  = ref<TimeFrame>('this_week')
const rangeMode = ref<'preset' | 'custom'>('preset')
const customRangeModel = ref<Date[] | null>(null)
const gameSearchQ   = ref('')
const selectedGame  = ref<string>('all')
const gameDropOpen  = ref(false)
const filtersOpen   = ref(false)

const gameSelectTriggerRef = ref<HTMLElement | null>(null)
const gameMenuFixedStyle = ref<Record<string, string>>({})

function syncGameMenuGeometry() {
  const el = gameSelectTriggerRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const vw = window.innerWidth
  const pad = 8
  const width = Math.min(r.width, vw - pad * 2)
  const left = Math.min(Math.max(r.left, pad), vw - width - pad)
  gameMenuFixedStyle.value = {
    left: `${left}px`,
    top: `${r.bottom + 6}px`,
    width: `${width}px`,
  }
}

let removeGameMenuPositionListeners: (() => void) | null = null

watch(gameDropOpen, async open => {
  if (open) {
    await nextTick()
    syncGameMenuGeometry()
    const onMove = () => syncGameMenuGeometry()
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
    removeGameMenuPositionListeners = () => {
      window.removeEventListener('scroll', onMove, true)
      window.removeEventListener('resize', onMove)
      removeGameMenuPositionListeners = null
    }
  } else {
    removeGameMenuPositionListeners?.()
  }
})

onUnmounted(() => {
  removeGameMenuPositionListeners?.()
})

type RecordsTabId = 'records' | 'report'
const recordsTab = ref<RecordsTabId>('records')

watch(recordsTab, () => {
  gameDropOpen.value = false
})

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

interface GameRecord {
  id: string
  hall: string
  game: string
  gameId: 'baccarat' | 'slots' | 'roulette' | 'poker'
  date: string
  time: string
  bet: number
  effectiveBet: number
  result: 'win' | 'lose' | 'draw'
  payout: number
  roundId: string
}

function toYmd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfWeekMonday(d: Date): Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const dow = copy.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  copy.setDate(copy.getDate() + diff)
  return copy
}

function buildStaticDemoRecords(): GameRecord[] {
  const today0 = new Date()
  today0.setHours(0, 0, 0, 0)
  const weekStart = startOfWeekMonday(today0)
  const ymds: string[] = []
  const cur = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())
  const end = new Date(today0.getFullYear(), today0.getMonth(), today0.getDate())
  while (cur.getTime() <= end.getTime()) {
    ymds.push(toYmd(cur))
    cur.setDate(cur.getDate() + 1)
  }
  if (ymds.length === 0) ymds.push(toYmd(today0))

  const templates: Omit<GameRecord, 'date'>[] = [
    { id: '1',  hall: 'Super 體育', game: 'バカラ',    gameId: 'baccarat', time: '22:14', bet: 5_000,  effectiveBet: 5_000,  result: 'win',  payout: 9_750,  roundId: 'BCC-88142' },
    { id: '2',  hall: 'OB 真人',   game: 'スロット',  gameId: 'slots',    time: '21:55', bet: 1_000,  effectiveBet: 1_000,  result: 'lose', payout: 0,      roundId: 'SLT-20934' },
    { id: '3',  hall: 'Super 體育', game: 'ルーレット',gameId: 'roulette', time: '21:30', bet: 3_000,  effectiveBet: 3_000,  result: 'win',  payout: 5_850,  roundId: 'RLT-55671' },
    { id: '4',  hall: 'AG 真人',   game: 'ポーカー',  gameId: 'poker',    time: '19:03', bet: 10_000, effectiveBet: 10_000, result: 'lose', payout: 0,      roundId: 'PKR-11028' },
    { id: '5',  hall: 'Super 體育', game: 'バカラ',    gameId: 'baccarat', time: '18:47', bet: 8_000,  effectiveBet: 8_000,  result: 'draw', payout: 8_000,  roundId: 'BCC-88099' },
    { id: '6',  hall: 'WM 體育',   game: 'スロット',  gameId: 'slots',    time: '17:22', bet: 500,    effectiveBet: 500,    result: 'win',  payout: 2_500,  roundId: 'SLT-20891' },
    { id: '7',  hall: 'Super 體育', game: 'バカラ',    gameId: 'baccarat', time: '23:05', bet: 5_000,  effectiveBet: 4_500,  result: 'win',  payout: 9_750,  roundId: 'BCC-87944' },
    { id: '8',  hall: 'OB 真人',   game: 'ルーレット',gameId: 'roulette', time: '20:18', bet: 2_000,  effectiveBet: 2_000,  result: 'lose', payout: 0,      roundId: 'RLT-55512' },
    { id: '9',  hall: 'Super 體育', game: 'ポーカー',  gameId: 'poker',    time: '16:44', bet: 15_000, effectiveBet: 15_000, result: 'win',  payout: 29_250, roundId: 'PKR-10877' },
    { id: '10', hall: 'AG 真人',   game: 'スロット',  gameId: 'slots',    time: '14:30', bet: 1_000,  effectiveBet: 1_000,  result: 'lose', payout: 0,      roundId: 'SLT-20755' },
    { id: '11', hall: 'WM 體育',   game: 'バカラ',    gameId: 'baccarat', time: '22:51', bet: 6_000,  effectiveBet: 6_000,  result: 'win',  payout: 11_700, roundId: 'BCC-87800' },
    { id: '12', hall: 'Super 體育', game: 'ルーレット',gameId: 'roulette', time: '19:09', bet: 4_000,  effectiveBet: 3_800,  result: 'lose', payout: 0,      roundId: 'RLT-55300' },
  ]

  return templates.map((row, i) => ({
    ...row,
    date: ymds[i % ymds.length]!,
  }))
}

const allRecords: GameRecord[] = buildStaticDemoRecords()

const pickerMaxDate = computed(() => {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate())
})

const isDatePickerDark = computed(() => (themeCtx?.theme.value ?? 'dark') === 'dark')

watch(customRangeModel, (v) => {
  if (v == null || (Array.isArray(v) && v.length === 0)) {
    rangeMode.value = 'preset'
    return
  }
  if (Array.isArray(v) && v[0] instanceof Date) {
    rangeMode.value = 'custom'
  }
}, { deep: true })

const customRangeActive = computed(() => {
  const v = customRangeModel.value
  if (rangeMode.value !== 'custom' || !Array.isArray(v) || !(v[0] instanceof Date)) return false
  const end = v[1] instanceof Date ? v[1] : v[0]
  return toYmd(v[0]) <= toYmd(end)
})

function onPresetTime(tf: TimeFrame) {
  rangeMode.value = 'preset'
  selectedTime.value = tf
  customRangeModel.value = null
}

function clearCustomRange() {
  customRangeModel.value = null
  rangeMode.value = 'preset'
}

const filteredRecords = computed(() => {
  const now = new Date()
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayStr = toYmd(today0)

  const y0 = new Date(today0)
  y0.setDate(y0.getDate() - 1)
  const yesterdayStr = toYmd(y0)

  const monThis = startOfWeekMonday(today0)
  const sunThis = new Date(monThis)
  sunThis.setDate(monThis.getDate() + 6)
  const thisWeekStart = toYmd(monThis)
  const thisWeekEnd = toYmd(sunThis)

  const monLast = new Date(monThis)
  monLast.setDate(monLast.getDate() - 7)
  const sunLast = new Date(monLast)
  sunLast.setDate(monLast.getDate() + 6)
  const lastWeekStart = toYmd(monLast)
  const lastWeekEnd = toYmd(sunLast)

  const monthStart = new Date(today0.getFullYear(), today0.getMonth(), 1)
  const monthStartStr = toYmd(monthStart)

  return allRecords.filter((r) => {
    if (selectedGame.value !== 'all' && r.gameId !== selectedGame.value) return false
    const rd = r.date

    if (customRangeActive.value) {
      const v = customRangeModel.value as Date[]
      const from = toYmd(v[0])
      const to = toYmd(v[1] instanceof Date ? v[1] : v[0])
      return rd >= from && rd <= to
    }

    switch (selectedTime.value) {
      case 'today':
        return rd === todayStr
      case 'yesterday':
        return rd === yesterdayStr
      case 'this_week':
        return rd >= thisWeekStart && rd <= thisWeekEnd
      case 'last_week':
        return rd >= lastWeekStart && rd <= lastWeekEnd
      case 'this_month':
        return rd >= monthStartStr && rd <= todayStr
      default:
        return false
    }
  })
})

const stats = computed(() => {
  const records = filteredRecords.value
  const totalBet  = records.reduce((s, r) => s + r.bet, 0)
  const totalPay  = records.reduce((s, r) => s + r.payout, 0)
  const netPnL    = totalPay - totalBet
  const wins      = records.filter(r => r.result === 'win').length
  const winRate   = records.length ? Math.round((wins / records.length) * 100) : 0
  return { totalBet, totalPay, netPnL, totalGames: records.length, wins, winRate }
})

function fmt(n: number) { return n.toLocaleString('ja-JP') }

const gameIconMap: Record<string, unknown> = {
  baccarat: Spade,
  slots:    Zap,
  roulette: Dices,
  poker:    Star,
}

function recordNetPnL(r: GameRecord) {
  return r.payout - r.bet
}

function fmtNetSigned(net: number) {
  const s = fmt(net)
  return net > 0 ? `+${s}` : s
}

function netPnLClass(net: number) {
  if (net > 0) return 'text-neon-mint'
  if (net < 0) return 'text-destructive'
  return 'text-muted-foreground'
}

const focusedRecordId = ref<string | null>(null)

function openRecordDetail(r: GameRecord) {
  focusedRecordId.value = focusedRecordId.value === r.id ? null : r.id
}

const tableRecords = computed(() =>
  [...filteredRecords.value].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date)
    return b.time.localeCompare(a.time)
  }),
)

/** 報表用：反水為演示係數（有效投注 × 比例） */
const HALL_REPORT_REBATE_RATE = 0.002

const HALL_PALETTE = [
  {
    border: 'border-neon-purple/50', bg: 'bg-neon-purple/8',
    nameText: 'text-neon-purple', bar: 'bg-neon-purple', rebate: 'text-neon-purple',
    glow: '0 0 0 1px color-mix(in oklch,var(--neon-purple) 25%,transparent), 0 6px 24px -4px color-mix(in oklch,var(--neon-purple) 30%,transparent)',
    nameGlow: '0 0 8px oklch(0.62 0.28 305 / 0.75)',
  },
  {
    border: 'border-neon-mint/50', bg: 'bg-neon-mint/8',
    nameText: 'text-neon-mint', bar: 'bg-neon-mint', rebate: 'text-neon-mint',
    glow: '0 0 0 1px color-mix(in oklch,var(--neon-mint) 25%,transparent), 0 6px 24px -4px color-mix(in oklch,var(--neon-mint) 30%,transparent)',
    nameGlow: '0 0 8px oklch(0.82 0.19 168 / 0.75)',
  },
  {
    border: 'border-yellow-400/50', bg: 'bg-yellow-400/8',
    nameText: 'text-yellow-400', bar: 'bg-yellow-400', rebate: 'text-yellow-400',
    glow: '0 0 0 1px color-mix(in oklch,oklch(0.85 0.18 85) 25%,transparent), 0 6px 24px -4px color-mix(in oklch,oklch(0.85 0.18 85) 30%,transparent)',
    nameGlow: '0 0 8px oklch(0.85 0.18 85 / 0.70)',
  },
  {
    border: 'border-sky-400/50', bg: 'bg-sky-400/8',
    nameText: 'text-sky-400', bar: 'bg-sky-400', rebate: 'text-sky-400',
    glow: '0 0 0 1px color-mix(in oklch,oklch(0.75 0.18 220) 25%,transparent), 0 6px 24px -4px color-mix(in oklch,oklch(0.75 0.18 220) 30%,transparent)',
    nameGlow: '0 0 8px oklch(0.75 0.18 220 / 0.70)',
  },
  {
    border: 'border-rose-400/50', bg: 'bg-rose-400/8',
    nameText: 'text-rose-400', bar: 'bg-rose-400', rebate: 'text-rose-400',
    glow: '0 0 0 1px color-mix(in oklch,oklch(0.68 0.22 10) 25%,transparent), 0 6px 24px -4px color-mix(in oklch,oklch(0.68 0.22 10) 30%,transparent)',
    nameGlow: '0 0 8px oklch(0.68 0.22 10 / 0.70)',
  },
  {
    border: 'border-amber-400/50', bg: 'bg-amber-400/8',
    nameText: 'text-amber-400', bar: 'bg-amber-400', rebate: 'text-amber-400',
    glow: '0 0 0 1px color-mix(in oklch,oklch(0.83 0.18 80) 25%,transparent), 0 6px 24px -4px color-mix(in oklch,oklch(0.83 0.18 80) 30%,transparent)',
    nameGlow: '0 0 8px oklch(0.83 0.18 80 / 0.70)',
  },
]

const reportByHall = computed(() => {
  const acc: Record<
    string,
    { hall: string; turnover: number; bet: number; payout: number; count: number }
  > = {}
  for (const r of filteredRecords.value) {
    const key = r.hall
    if (!acc[key]) {
      acc[key] = { hall: r.hall, turnover: 0, bet: 0, payout: 0, count: 0 }
    }
    const row = acc[key]
    row.turnover += r.effectiveBet
    row.bet += r.bet
    row.payout += r.payout
    row.count += 1
  }
  return Object.values(acc)
    .map((row) => {
      const net = row.payout - row.bet
      const rebate = Math.round(row.turnover * HALL_REPORT_REBATE_RATE)
      return { ...row, net, rebate }
    })
    .sort((a, b) => b.turnover - a.turnover)
    .map((row, i) => ({ ...row, colorIdx: i % HALL_PALETTE.length }))
})

</script>

<template>
  <main
    class="min-h-screen bg-background pt-20 relative overflow-x-hidden"
    aria-label="ゲーム記録"
  >
    
    <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-neon-mint/[0.05] blur-[120px]" />
      <div class="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-neon-purple/[0.06] blur-[100px]" />
      <div class="absolute bottom-0 left-1/3 w-[360px] h-[360px] rounded-full bg-neon-mint/[0.04] blur-[140px]" />
    </div>

    <div class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 space-y-5">

      
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

        
        <button
          v-show="recordsTab === 'records'"
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
          
          <div
            :class="cn('absolute top-0 left-3 right-3 h-[1.5px] rounded-full opacity-60', card.color.replace('text-', 'bg-'))"
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        class="relative flex rounded-2xl border border-border/60 bg-surface-2/40 backdrop-blur-md p-1 animate-fade-up delay-75"
        role="tablist"
        aria-label="記録とレポートの切り替え"
      >
        <span
          class="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-neon-mint/15 border border-neon-mint/35 ring-1 ring-neon-mint/15 transition-transform duration-300 ease-[cubic-bezier(0.34,1.2,0.64,1)] pointer-events-none"
          :style="{ transform: recordsTab === 'records' ? 'translateX(0%)' : 'translateX(100%)' }"
          aria-hidden="true"
        />
        <button
          type="button"
          role="tab"
          :aria-selected="recordsTab === 'records'"
          aria-controls="panel-bet-records"
          id="tab-bet-records"
          :class="cn(
            'relative z-10 flex-1 flex items-center justify-center gap-2 h-10 rounded-xl font-display text-xs sm:text-sm font-black tracking-[0.08em] transition-colors duration-200 touch-press',
            recordsTab === 'records' ? 'text-neon-mint' : 'text-muted-foreground hover:text-foreground',
          )"
          @click="recordsTab = 'records'"
        >
          <LayoutList class="w-4 h-4 shrink-0" aria-hidden="true" />
          ベット記録
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="recordsTab === 'report'"
          aria-controls="panel-bet-report"
          id="tab-bet-report"
          :class="cn(
            'relative z-10 flex-1 flex items-center justify-center gap-2 h-10 rounded-xl font-display text-xs sm:text-sm font-black tracking-[0.08em] transition-colors duration-200 touch-press',
            recordsTab === 'report' ? 'text-neon-mint' : 'text-muted-foreground hover:text-foreground',
          )"
          @click="recordsTab = 'report'"
        >
          <ChartColumnIncreasing class="w-4 h-4 shrink-0" aria-hidden="true" />
          ベット報告
        </button>
      </div>

      <div v-show="recordsTab === 'records'" id="panel-bet-records" role="tabpanel" aria-labelledby="tab-bet-records" class="space-y-5">
        <Transition name="slide-filters">
          <section
            v-show="filtersOpen || true"
            class="rounded-2xl border border-border/50 bg-surface-1/70 backdrop-blur-md overflow-visible animate-fade-up delay-100"
            aria-label="フィルター"
          >
            <div class="p-4 sm:p-5 space-y-4">

              <div>
                <p class="font-display text-[9px] font-black tracking-[0.25em] text-muted-foreground mb-2.5 uppercase flex items-center gap-1.5">
                  <CalendarRange class="w-3 h-3 text-neon-purple shrink-0" aria-hidden="true" />
                  日期區間
                </p>
                <div
                  class="rounded-2xl border border-border/60 bg-surface-2/50 backdrop-blur-sm p-2 sm:p-3 ring-1 ring-neon-purple/5 game-records-dp"
                >
                  <VueDatePicker
                    ref="rangePickerRef"
                    v-model="customRangeModel"
                    @update:model-value="onCustomRangeModelUpdate"
                    range
                    teleport="body"
                    week-start="1"
                    :dark="isDatePickerDark"
                    :locale="ja"
                    :time-picker="false"
                    :auto-apply="false"
                    :focus-start-date="rangeFocusStart"
                    :max-date="pickerMaxDate"
                    :formats="{ input: 'yyyy-MM-dd' }"
                    :action-row="datePickerActionRow"
                    @open="onRangeMenuOpen"
                    @closed="onRangeMenuClosed"
                    @internal-model-change="onRangeInternalChange"
                    @range-start="onRangePickerRangeStart"
                  >
                    <template #trigger>
                      <div class="flex w-full gap-2" @click.stop>
                        <button
                          type="button"
                          class="flex-1 min-w-0 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 touch-press relative group"
                          :class="cn(
                            startBoxActive
                              ? 'border-neon-mint/55 bg-neon-mint/10 ring-2 ring-neon-purple/25 shadow-[0_0_0_1px_color-mix(in_oklch,var(--neon-mint)_35%,transparent)]'
                              : 'border-border/60 bg-surface-2/45 hover:border-neon-mint/30 hover:bg-surface-2/65',
                          )"
                          @click.stop="openRangeFromStart"
                        >
                          <span class="block font-body text-[10px] font-semibold text-muted-foreground tracking-wide">
                            開始
                          </span>
                          <span
                            class="block font-display text-sm font-bold text-foreground tabular-nums mt-0.5 truncate pr-6"
                          >
                            {{ rangeStartLabel || '—' }}
                          </span>
                          <span
                            v-if="rangeStartLabel"
                            role="button"
                            tabindex="0"
                            class="absolute right-2 top-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded-full text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/15 transition-colors touch-press"
                            aria-label="日付をクリア"
                            @click.stop="clearRangeTrigger"
                          >
                            <X class="size-3.5" aria-hidden="true" />
                          </span>
                        </button>
                        <button
                          type="button"
                          class="flex-1 min-w-0 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 touch-press relative group"
                          :class="cn(
                            endBoxActive
                              ? 'border-neon-mint/55 bg-neon-mint/10 ring-2 ring-neon-purple/25 shadow-[0_0_0_1px_color-mix(in_oklch,var(--neon-mint)_35%,transparent)]'
                              : 'border-border/60 bg-surface-2/45 hover:border-neon-mint/30 hover:bg-surface-2/65',
                          )"
                          @click.stop="openRangeFromEnd"
                        >
                          <span class="block font-body text-[10px] font-semibold text-muted-foreground tracking-wide">
                            終了
                          </span>
                          <span class="block font-display text-sm font-bold text-foreground tabular-nums mt-0.5 truncate pr-6">
                            {{ rangeEndLabel || '—' }}
                          </span>
                          <span
                            v-if="rangeEndLabel"
                            role="button"
                            tabindex="0"
                            class="absolute right-2 top-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded-full text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/15 transition-colors touch-press"
                            aria-label="日付をクリア"
                            @click.stop="clearRangeTrigger"
                          >
                            <X class="size-3.5" aria-hidden="true" />
                          </span>
                        </button>
                      </div>
                    </template>
                    <template #action-preview="{ formatValue }">
                      <div class="flex min-w-0 flex-1 flex-col gap-0.5 text-left pr-2">
                        <span class="font-body text-[10px] leading-snug text-muted-foreground">
                          期間選択後に「套用」で記録を絞り込み
                        </span>
                        <span
                          v-if="formatValue"
                          class="font-mono text-[11px] font-medium tabular-nums text-foreground truncate"
                        >
                          {{ formatValue }}
                        </span>
                      </div>
                    </template>
                  </VueDatePicker>
                  <p
                    v-if="customRangeActive"
                    class="mt-2.5 font-body text-[10px] text-neon-mint/90 tracking-wide px-0.5"
                  >
                    已套用自訂區間
                  </p>
                  <button
                    v-if="customRangeModel"
                    type="button"
                    class="mt-2 w-full h-9 rounded-xl border border-border/60 bg-surface-2/60 font-body text-xs font-semibold text-muted-foreground hover:text-neon-mint hover:border-neon-mint/35 hover:bg-neon-mint/10 transition-all duration-200 touch-press"
                    @click="clearCustomRange"
                  >
                    クリア
                  </button>
                </div>
              </div>

              <div>
                <p class="font-display text-[9px] font-black tracking-[0.25em] text-muted-foreground mb-2.5 uppercase">
                  期間
                </p>
                <div
                  class="flex gap-1 sm:gap-1.5 w-full"
                  role="group"
                  aria-label="期間フィルター"
                >
                  <button
                    v-for="tf in timeFrames"
                    :key="tf.key"
                    type="button"
                    :class="cn(
                      'relative z-0 flex-1 min-w-0 h-8 max-sm:px-1 px-2 sm:px-2.5 rounded-xl font-display text-[10px] sm:text-xs font-black tracking-tight sm:tracking-wide text-center transition-all duration-200 touch-press border',
                      rangeMode === 'preset' && selectedTime === tf.key
                        ? 'bg-neon-mint/15 border-neon-mint/40 text-neon-mint glow-mint'
                        : 'bg-surface-2/60 border-border/50 text-muted-foreground hover:border-neon-mint/30 hover:text-foreground hover:bg-surface-2',
                    )"
                    :aria-pressed="rangeMode === 'preset' && selectedTime === tf.key"
                    @click="onPresetTime(tf.key)"
                  >
                    {{ tf.label }}

                    <span
                      v-if="rangeMode === 'preset' && selectedTime === tf.key"
                      class="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-neon-mint animate-neon-pulse"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              
              <div>
                <p class="font-display text-[9px] font-black tracking-[0.25em] text-muted-foreground mb-2.5 uppercase">
                  ゲーム
                </p>
                <div class="relative">
                  <button
                    ref="gameSelectTriggerRef"
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
                </div>

                <Teleport to="body">
                  <template v-if="gameDropOpen">
                    <div
                      class="fixed inset-0 z-[75] bg-transparent"
                      aria-hidden="true"
                      @click="gameDropOpen = false"
                    />
                    <div
                      class="fixed z-[80] rounded-2xl border border-border/70 bg-surface-1/95 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] overflow-hidden"
                      role="listbox"
                      aria-label="ゲームリスト"
                      :style="gameMenuFixedStyle"
                    >
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
                  </template>
                </Teleport>
              </div>
            </div>
          </section>
        </Transition>

        
        <section aria-label="ベット詳細" class="space-y-4 animate-fade-up delay-200">
          <h2 class="font-display text-[10px] font-black tracking-[0.25em] text-muted-foreground px-1 uppercase">
            ベット詳細 &mdash; {{ filteredRecords.length }} 件
          </h2>

          
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

          
          <template v-if="filteredRecords.length > 0">
            <div
              class="relative overflow-hidden rounded-2xl border border-border/50 bg-surface-1/60 backdrop-blur-md ring-1 ring-neon-purple/[0.06]"
            >
              <div
                class="pointer-events-none absolute -right-24 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-neon-purple/[0.06] blur-3xl"
                aria-hidden="true"
              />
              <div class="relative w-full min-w-0">
                <table class="w-full table-fixed border-collapse text-left">
                  <thead>
                    <tr class="border-b border-border/45 bg-surface-2/80">
                      <th
                        scope="col"
                        class="w-[24%] max-w-0 px-1.5 py-2.5 text-center font-display text-[9px] font-black leading-tight tracking-wide text-foreground sm:px-3 sm:py-3.5 sm:text-[10px] sm:tracking-[0.2em]"
                      >
                        館別
                      </th>
                      <th
                        scope="col"
                        class="w-[19%] max-w-0 px-1 py-2.5 text-right font-display text-[9px] font-black leading-tight tracking-wide text-foreground sm:px-2 sm:py-3.5 sm:text-[10px] sm:tracking-[0.2em]"
                      >
                        投注金額
                      </th>
                      <th
                        scope="col"
                        class="w-[19%] max-w-0 px-1 py-2.5 text-right font-display text-[9px] font-black leading-tight tracking-wide text-foreground sm:px-2 sm:py-3.5 sm:text-[10px] sm:tracking-[0.2em]"
                      >
                        有效投注
                      </th>
                      <th
                        scope="col"
                        class="w-[18%] max-w-0 px-1 py-2.5 text-right font-display text-[9px] font-black leading-tight tracking-wide text-foreground sm:px-2 sm:py-3.5 sm:text-[10px] sm:tracking-[0.2em]"
                      >
                        輸贏
                      </th>
                      <th
                        scope="col"
                        class="w-[20%] max-w-0 px-1.5 py-2.5 text-center font-display text-[9px] font-black leading-tight tracking-wide text-foreground sm:px-2 sm:py-3.5 sm:text-[10px] sm:tracking-[0.2em]"
                      >
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="record in tableRecords"
                      :key="record.id"
                      :class="cn(
                        'border-b border-border/20 transition-colors duration-150',
                        'odd:bg-surface-1/30 even:bg-surface-2/20 hover:bg-neon-mint/[0.04]',
                        focusedRecordId === record.id && 'bg-neon-mint/[0.07] ring-1 ring-inset ring-neon-mint/20',
                      )"
                    >
                      <td class="max-w-0 px-1.5 py-2 align-middle sm:px-3 sm:py-3 sm:px-4">
                        <div class="flex min-w-0 flex-col gap-0.5 text-center sm:items-start sm:text-left">
                          <span class="break-words font-body text-[11px] font-semibold leading-snug text-foreground sm:text-xs">{{ record.hall }}</span>
                          <span class="break-all font-mono text-[9px] leading-tight text-muted-foreground/70 sm:text-[10px]">{{ record.roundId }}</span>
                        </div>
                      </td>
                      <td class="max-w-0 px-1 py-2 text-right align-middle font-display text-[10px] font-bold tabular-nums text-foreground sm:px-2 sm:py-3 sm:text-xs sm:px-4">
                        {{ fmt(record.bet) }}
                      </td>
                      <td class="max-w-0 px-1 py-2 text-right align-middle font-display text-[10px] font-bold tabular-nums text-foreground sm:px-2 sm:py-3 sm:text-xs sm:px-4">
                        {{ fmt(record.effectiveBet) }}
                      </td>
                      <td
                        class="max-w-0 px-1 py-2 text-right align-middle font-display text-[10px] font-black tabular-nums sm:px-3 sm:py-3 sm:text-xs sm:px-4"
                        :class="netPnLClass(recordNetPnL(record))"
                      >
                        {{ fmtNetSigned(recordNetPnL(record)) }}
                      </td>
                      <td class="max-w-0 px-1 py-2 text-center align-middle sm:px-2 sm:py-3 sm:px-4">
                        <button
                          type="button"
                          class="inline-flex min-w-0 max-w-full items-center justify-center rounded-full border border-destructive/35 bg-destructive px-2 py-1 font-body text-[10px] font-bold leading-none text-destructive-foreground shadow-[0_0_12px_oklch(0.58_0.22_25/0.25)] transition-all duration-200 hover:border-destructive/50 hover:bg-destructive/90 active:scale-[0.98] touch-press sm:px-3.5 sm:py-1.5 sm:text-[11px]"
                          @click="openRecordDetail(record)"
                        >
                          詳細
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="border-t border-border/35 px-3 py-2 text-center font-mono text-[10px] text-muted-foreground/70 sm:text-left sm:px-4">
                pt · {{ filteredRecords.length }} 件
              </p>
            </div>
          </template>
        </section>
      </div>

      <div
        v-show="recordsTab === 'report'"
        id="panel-bet-report"
        role="tabpanel"
        aria-labelledby="tab-bet-report"
        class="space-y-4 animate-fade-up delay-100"
      >
        <section
          class="rounded-2xl border border-border/50 bg-surface-1/70 backdrop-blur-md overflow-visible"
          aria-label="報告用フィルター"
        >
          <div class="p-4 sm:p-5 space-y-4">
            <div>
              <p class="font-display text-[9px] font-black tracking-[0.25em] text-muted-foreground mb-2.5 uppercase flex items-center gap-1.5">
                <CalendarRange class="w-3 h-3 text-neon-purple shrink-0" aria-hidden="true" />
                日期區間
              </p>
              <div
                class="rounded-2xl border border-border/60 bg-surface-2/50 backdrop-blur-sm p-2 sm:p-3 ring-1 ring-neon-purple/5 game-records-dp"
              >
                <VueDatePicker
                  ref="reportRangePickerRef"
                  v-model="customRangeModel"
                  @update:model-value="onCustomRangeModelUpdate"
                  range
                  teleport="body"
                  week-start="1"
                  :dark="isDatePickerDark"
                  :locale="ja"
                  :time-picker="false"
                  :auto-apply="false"
                  :focus-start-date="rangeFocusStart"
                  :max-date="pickerMaxDate"
                  :formats="{ input: 'yyyy-MM-dd' }"
                  :action-row="datePickerActionRow"
                  @open="onRangeMenuOpen"
                  @closed="onRangeMenuClosed"
                  @internal-model-change="onRangeInternalChange"
                  @range-start="onRangePickerRangeStart"
                >
                  <template #trigger>
                    <div class="flex w-full gap-2" @click.stop>
                      <button
                        type="button"
                        class="flex-1 min-w-0 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 touch-press relative group"
                        :class="cn(
                          startBoxActive
                            ? 'border-neon-mint/55 bg-neon-mint/10 ring-2 ring-neon-purple/25 shadow-[0_0_0_1px_color-mix(in_oklch,var(--neon-mint)_35%,transparent)]'
                            : 'border-border/60 bg-surface-2/45 hover:border-neon-mint/30 hover:bg-surface-2/65',
                        )"
                        @click.stop="openRangeFromStart"
                      >
                        <span class="block font-body text-[10px] font-semibold text-muted-foreground tracking-wide">
                          開始
                        </span>
                        <span
                          class="block font-display text-sm font-bold text-foreground tabular-nums mt-0.5 truncate pr-6"
                        >
                          {{ rangeStartLabel || '—' }}
                        </span>
                        <span
                          v-if="rangeStartLabel"
                          role="button"
                          tabindex="0"
                          class="absolute right-2 top-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded-full text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/15 transition-colors touch-press"
                          aria-label="日付をクリア"
                          @click.stop="clearRangeTrigger"
                        >
                          <X class="size-3.5" aria-hidden="true" />
                        </span>
                      </button>
                      <button
                        type="button"
                        class="flex-1 min-w-0 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 touch-press relative group"
                        :class="cn(
                          endBoxActive
                            ? 'border-neon-mint/55 bg-neon-mint/10 ring-2 ring-neon-purple/25 shadow-[0_0_0_1px_color-mix(in_oklch,var(--neon-mint)_35%,transparent)]'
                            : 'border-border/60 bg-surface-2/45 hover:border-neon-mint/30 hover:bg-surface-2/65',
                        )"
                        @click.stop="openRangeFromEnd"
                      >
                        <span class="block font-body text-[10px] font-semibold text-muted-foreground tracking-wide">
                          終了
                        </span>
                        <span class="block font-display text-sm font-bold text-foreground tabular-nums mt-0.5 truncate pr-6">
                          {{ rangeEndLabel || '—' }}
                        </span>
                        <span
                          v-if="rangeEndLabel"
                          role="button"
                          tabindex="0"
                          class="absolute right-2 top-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded-full text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/15 transition-colors touch-press"
                          aria-label="日付をクリア"
                          @click.stop="clearRangeTrigger"
                        >
                          <X class="size-3.5" aria-hidden="true" />
                        </span>
                      </button>
                    </div>
                  </template>
                  <template #action-preview="{ formatValue }">
                    <div class="flex min-w-0 flex-1 flex-col gap-0.5 text-left pr-2">
                      <span class="font-body text-[10px] leading-snug text-muted-foreground">
                        期間選択後に「套用」で記録を絞り込み
                      </span>
                      <span
                        v-if="formatValue"
                        class="font-mono text-[11px] font-medium tabular-nums text-foreground truncate"
                      >
                        {{ formatValue }}
                      </span>
                    </div>
                  </template>
                </VueDatePicker>
                <p
                  v-if="customRangeActive"
                  class="mt-2.5 font-body text-[10px] text-neon-mint/90 tracking-wide px-0.5"
                >
                  已套用自訂區間
                </p>
                <button
                  v-if="customRangeModel"
                  type="button"
                  class="mt-2 w-full h-9 rounded-xl border border-border/60 bg-surface-2/60 font-body text-xs font-semibold text-muted-foreground hover:text-neon-mint hover:border-neon-mint/35 hover:bg-neon-mint/10 transition-all duration-200 touch-press"
                  @click="clearCustomRange"
                >
                  クリア
                </button>
              </div>
            </div>

            <div>
              <p class="font-display text-[9px] font-black tracking-[0.25em] text-muted-foreground mb-2.5 uppercase">
                期間
              </p>
              <div
                class="flex gap-1 sm:gap-1.5 w-full"
                role="group"
                aria-label="期間フィルター"
              >
                <button
                  v-for="tf in timeFrames"
                  :key="tf.key"
                  type="button"
                  :class="cn(
                    'relative z-0 flex-1 min-w-0 h-8 max-sm:px-1 px-2 sm:px-2.5 rounded-xl font-display text-[10px] sm:text-xs font-black tracking-tight sm:tracking-wide text-center transition-all duration-200 touch-press border',
                    rangeMode === 'preset' && selectedTime === tf.key
                      ? 'bg-neon-mint/15 border-neon-mint/40 text-neon-mint glow-mint'
                      : 'bg-surface-2/60 border-border/50 text-muted-foreground hover:border-neon-mint/30 hover:text-foreground hover:bg-surface-2',
                  )"
                  :aria-pressed="rangeMode === 'preset' && selectedTime === tf.key"
                  @click="onPresetTime(tf.key)"
                >
                  {{ tf.label }}

                  <span
                    v-if="rangeMode === 'preset' && selectedTime === tf.key"
                    class="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-neon-mint animate-neon-pulse"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div class="rounded-2xl border border-border/50 bg-surface-1/70 backdrop-blur-md p-3 sm:p-4">
          <h2 class="font-display text-[10px] font-black tracking-[0.25em] text-muted-foreground uppercase mb-1">
            遊戲館別集計
          </h2>
          <p class="font-body text-[11px] text-muted-foreground/80 mb-3">
            此處可調整日期區間與期間預設；遊戲篩選請至「ベット記録」タブ。匯總各館碼量（有效投注合計）、輸贏、反水。
          </p>

          <div
            v-if="reportByHall.length === 0"
            class="flex flex-col items-center justify-center gap-3 py-12 text-center rounded-xl border border-border/40 bg-surface-2/40"
          >
            <BarChart3 class="w-8 h-8 text-muted-foreground/40" aria-hidden="true" />
            <p class="font-body text-sm text-muted-foreground">表示できる集計がありません</p>
          </div>

          <ul
            v-else
            class="grid grid-cols-3 gap-1.5 list-none p-0 m-0"
            role="list"
            aria-label="遊戲館別集計"
          >
            <li
              v-for="row in reportByHall"
              :key="row.hall"
              class="relative overflow-hidden rounded-xl border backdrop-blur-sm my-1"
              :class="[HALL_PALETTE[row.colorIdx].border, HALL_PALETTE[row.colorIdx].bg]"
              :style="{ boxShadow: HALL_PALETTE[row.colorIdx].glow }"
            >
              <div
                class="absolute inset-x-0 top-0 h-[2px]"
                :class="HALL_PALETTE[row.colorIdx].bar"
                aria-hidden="true"
              />

              <div class="px-1.5 pt-3.5 pb-1.5 text-center border-b border-border/30">
                <p
                  class="font-display text-[9px] sm:text-[10px] font-black tracking-[0.08em] uppercase leading-snug line-clamp-2"
                  :class="HALL_PALETTE[row.colorIdx].nameText"
                  :style="{ textShadow: HALL_PALETTE[row.colorIdx].nameGlow }"
                >
                  {{ row.hall }}
                </p>
              </div>

              <div class="px-1.5 py-2 space-y-1.5">
                <div class="flex items-baseline justify-between gap-0.5">
                  <span class="font-body text-[9px] sm:text-[10px] font-semibold tracking-[0.05em] uppercase text-foreground/80 shrink-0">碼量</span>
                  <span class="font-display text-[11px] sm:text-xs font-black tabular-nums text-foreground leading-none min-w-0 truncate text-right">{{ fmt(row.turnover) }}</span>
                </div>

                <div class="h-px bg-border/25" aria-hidden="true" />

                <div class="flex items-baseline justify-between gap-0.5">
                  <span class="font-body text-[9px] sm:text-[10px] font-semibold tracking-[0.05em] uppercase text-foreground/80 shrink-0">輸贏</span>
                  <span
                    class="font-display text-[11px] sm:text-xs font-black tabular-nums leading-none min-w-0 truncate text-right"
                    :class="row.net > 0 ? 'text-neon-mint' : row.net < 0 ? 'text-destructive' : 'text-muted-foreground'"
                  >{{ (row.net > 0 ? '+' : '') + fmt(row.net) }}</span>
                </div>

                <div class="h-px bg-border/25" aria-hidden="true" />

                <div class="flex items-baseline justify-between gap-0.5">
                  <span class="font-body text-[9px] sm:text-[10px] font-semibold tracking-[0.05em] uppercase text-foreground/80 shrink-0">反水</span>
                  <span
                    class="font-display text-[11px] sm:text-xs font-black tabular-nums leading-none min-w-0 truncate text-right"
                    :class="HALL_PALETTE[row.colorIdx].rebate"
                  >{{ fmt(row.rebate) }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
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

.game-records-dp :deep(.dp__input_wrap) {
  width: 100%;
  border-radius: 0.75rem;
  background: color-mix(in oklch, var(--surface-2), transparent 15%);
  border: 1px solid color-mix(in oklch, var(--border), transparent 40%);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.game-records-dp :deep(.dp__input_wrap:hover) {
  border-color: color-mix(in oklch, var(--neon-mint), transparent 55%);
}
.game-records-dp :deep(.dp__input_wrap.dp__input_focus) {
  border-color: color-mix(in oklch, var(--neon-mint), transparent 35%);
  box-shadow: 0 0 0 2px color-mix(in oklch, var(--neon-purple), transparent 75%);
}
.game-records-dp :deep(.dp__input) {
  min-height: 2.5rem;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  color: var(--foreground);
}
.game-records-dp :deep(.dp__input::placeholder) {
  color: color-mix(in oklch, var(--muted-foreground), transparent 35%);
}
.game-records-dp :deep(.dp__input_icon) {
  color: color-mix(in oklch, var(--neon-purple), transparent 15%);
}
.game-records-dp :deep(.dp__clear_icon) {
  color: color-mix(in oklch, var(--muted-foreground), transparent 10%);
}
</style>

<style>
body .dp--menu-wrapper {
  z-index: 70 !important;
}
body .dp--menu-wrapper .dp__menu {
  border-radius: var(--radius, 0.875rem);
  border-color: color-mix(in oklch, var(--neon-purple), transparent 72%);
  box-shadow: 0 0 0 1px color-mix(in oklch, var(--neon-mint), transparent 88%),
    0 20px 48px -12px oklch(0 0 0 / 0.55);
  --dp-border-radius: var(--radius);
  --dp-cell-border-radius: 9999px;
  --dp-font-family: var(--font-body, 'Inter', system-ui, sans-serif);
  --dp-calendar-header-cell-padding: 0.35rem 0;
  --dp-action-button-height: 2.25rem;
  --dp-action-buttons-padding: 4px 14px;
}
body .dp--menu-wrapper .dp__menu.dp__theme_dark {
  --dp-background-color: color-mix(in oklch, var(--surface-1), transparent 6%);
  --dp-text-color: var(--foreground);
  --dp-secondary-color: color-mix(in oklch, var(--muted-foreground), transparent 18%);
  --dp-border-color: color-mix(in oklch, var(--border), transparent 25%);
  --dp-menu-border-color: color-mix(in oklch, var(--neon-purple), transparent 70%);
  --dp-border-color-hover: color-mix(in oklch, var(--neon-mint), transparent 55%);
  --dp-border-color-focus: color-mix(in oklch, var(--neon-mint), transparent 40%);
  --dp-hover-color: color-mix(in oklch, var(--neon-mint), transparent 78%);
  --dp-hover-text-color: var(--foreground);
  --dp-hover-icon-color: var(--neon-mint);
  --dp-icon-color: color-mix(in oklch, var(--neon-mint), transparent 12%);
  --dp-primary-color: var(--neon-purple);
  --dp-primary-text-color: oklch(0.98 0.01 200);
  --dp-primary-disabled-color: color-mix(in oklch, var(--neon-purple), transparent 50%);
  --dp-highlight-color: color-mix(in oklch, var(--neon-purple), transparent 82%);
  --dp-range-between-dates-background-color: color-mix(in oklch, var(--neon-mint), transparent 86%);
  --dp-range-between-dates-text-color: var(--foreground);
  --dp-range-between-border-color: transparent;
  --dp-disabled-color: color-mix(in oklch, var(--surface-3), transparent 35%);
  --dp-disabled-color-text: color-mix(in oklch, var(--muted-foreground), transparent 28%);
  --dp-scroll-bar-background: var(--surface-2);
  --dp-scroll-bar-color: color-mix(in oklch, var(--neon-purple), transparent 60%);
  --dp-tooltip-color: var(--surface-2);
  --dp-loader: 4px solid var(--neon-purple);
}
body .dp--menu-wrapper .dp__menu.dp__theme_light {
  --dp-background-color: color-mix(in oklch, var(--popover), transparent 0%);
  --dp-text-color: var(--foreground);
  --dp-secondary-color: color-mix(in oklch, var(--muted-foreground), transparent 5%);
  --dp-border-color: color-mix(in oklch, var(--border), transparent 0%);
  --dp-menu-border-color: color-mix(in oklch, var(--neon-purple), transparent 78%);
  --dp-border-color-hover: color-mix(in oklch, var(--neon-mint), transparent 35%);
  --dp-border-color-focus: oklch(0.52 0.26 305);
  --dp-hover-color: color-mix(in oklch, var(--neon-mint), transparent 88%);
  --dp-hover-text-color: var(--foreground);
  --dp-hover-icon-color: var(--neon-purple);
  --dp-icon-color: color-mix(in oklch, var(--neon-purple), transparent 25%);
  --dp-primary-color: var(--neon-purple);
  --dp-primary-text-color: var(--primary-foreground);
  --dp-primary-disabled-color: color-mix(in oklch, var(--neon-purple), transparent 55%);
  --dp-highlight-color: color-mix(in oklch, var(--neon-purple), transparent 90%);
  --dp-range-between-dates-background-color: color-mix(in oklch, var(--neon-mint), transparent 82%);
  --dp-range-between-dates-text-color: var(--foreground);
  --dp-range-between-border-color: transparent;
  --dp-disabled-color: color-mix(in oklch, var(--muted), transparent 20%);
  --dp-disabled-color-text: var(--muted-foreground);
  --dp-scroll-bar-background: var(--surface-2);
  --dp-scroll-bar-color: color-mix(in oklch, var(--neon-purple), transparent 65%);
  --dp-tooltip-color: var(--popover);
  --dp-loader: 4px solid var(--neon-purple);
}
body .dp--menu-wrapper .dp__menu.dp__theme_dark .dp__action_select {
  font-weight: 700;
  letter-spacing: 0.06em;
  box-shadow: var(--glow-purple);
}
body .dp--menu-wrapper .dp__menu.dp__theme_light .dp__action_select {
  font-weight: 700;
}
</style>
