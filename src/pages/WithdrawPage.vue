<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  Building2,
  CreditCard,
  Bitcoin,
  Store,
  ChevronDown,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Info,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const router = useRouter()

// ── withdraw methods ───────────────────────────────────────────────────────
interface WithdrawMethod {
  id: string
  label: string
  labelEn: string
  icon: unknown
  minAmount: number
  maxAmount: number
  exchangeRate: number
  fee: string
  feeRate: number
  availableBalance: number
  color: string
}

const methods: WithdrawMethod[] = [
  {
    id: 'bank',
    label: '銀行ATM',
    labelEn: 'Bank ATM',
    icon: Building2,
    minAmount: 3_000,
    maxAmount: 30_000,
    exchangeRate: 1.00,
    fee: '0.00 + 0.00%',
    feeRate: 0,
    availableBalance: 0,
    color: 'neon-purple',
  },
  {
    id: 'credit',
    label: 'クレジット返金',
    labelEn: 'Credit Refund',
    icon: CreditCard,
    minAmount: 1_000,
    maxAmount: 50_000,
    exchangeRate: 1.00,
    fee: '0.00 + 2.00%',
    feeRate: 0.02,
    availableBalance: 0,
    color: 'neon-mint',
  },
  {
    id: 'crypto',
    label: '暗号通貨',
    labelEn: 'Cryptocurrency',
    icon: Bitcoin,
    minAmount: 500,
    maxAmount: 500_000,
    exchangeRate: 1.00,
    fee: '0.00 + 0.00%',
    feeRate: 0,
    availableBalance: 0,
    color: 'yellow-400',
  },
  {
    id: 'convenience',
    label: 'コンビニ払い',
    labelEn: 'Convenience Store',
    icon: Store,
    minAmount: 1_000,
    maxAmount: 49_000,
    exchangeRate: 1.00,
    fee: '0.00 + 0.00%',
    feeRate: 0,
    availableBalance: 0,
    color: 'neon-purple',
  },
]

const methodIconColor: Record<string, string> = {
  bank: 'text-neon-purple',
  credit: 'text-neon-mint',
  crypto: 'text-yellow-400',
  convenience: 'text-neon-purple',
}

// ── state ──────────────────────────────────────────────────────────────────
const selectedMethodId = ref<string>('bank')
const rawAmount = ref('')
const selectOpen = ref(false)
const amountError = ref('')
const submitting = ref(false)
const submitted = ref(false)
const amountInputRef = ref<HTMLInputElement | null>(null)

const selectedMethod = computed(() =>
  methods.find(m => m.id === selectedMethodId.value) ?? methods[0],
)

const numericAmount = computed(() => {
  const n = parseInt(rawAmount.value.replace(/,/g, ''), 10)
  return isNaN(n) ? 0 : n
})

const estimatedPayout = computed(() => {
  if (!selectedMethod.value || numericAmount.value <= 0) return 0
  const fee = numericAmount.value * selectedMethod.value.feeRate
  return Math.floor((numericAmount.value - fee) * selectedMethod.value.exchangeRate)
})

const canSubmit = computed(() => {
  if (!selectedMethod.value) return false
  if (numericAmount.value <= 0) return false
  if (numericAmount.value < selectedMethod.value.minAmount) return false
  if (numericAmount.value > selectedMethod.value.maxAmount) return false
  if (amountError.value) return false
  return true
})

watch(rawAmount, () => {
  if (!selectedMethod.value) { amountError.value = ''; return }
  const n = numericAmount.value
  if (n === 0) { amountError.value = ''; return }
  if (n < selectedMethod.value.minAmount)
    amountError.value = `提現方式最小出金: ¥${selectedMethod.value.minAmount.toLocaleString('ja-JP')}`
  else if (n > selectedMethod.value.maxAmount)
    amountError.value = `提現方式最大出金: ¥${selectedMethod.value.maxAmount.toLocaleString('ja-JP')}`
  else
    amountError.value = ''
})

watch(selectedMethodId, async () => {
  amountError.value = ''
  rawAmount.value = ''
  await nextTick()
  amountInputRef.value?.focus()
})

function selectMethod(id: string) {
  selectedMethodId.value = id
  selectOpen.value = false
}

function handleAmountInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/[^\d]/g, '')
  rawAmount.value = raw
}

async function handleSubmit() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  await new Promise(r => setTimeout(r, 1800))
  submitting.value = false
  submitted.value = true
}

function handleCancel() {
  router.back()
}

function reset() {
  submitted.value = false
  selectedMethodId.value = 'bank'
  rawAmount.value = ''
  amountError.value = ''
}

function onSelectBlur(e: FocusEvent) {
  if (!(e.relatedTarget as HTMLElement)?.closest('[data-select-panel]'))
    selectOpen.value = false
}
</script>

<template>
  <main
    class="relative min-h-screen bg-background pt-16 pb-28 overflow-x-hidden"
    aria-label="出金ページ"
  >
    <!-- ambient glows -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-neon-mint/[0.06] blur-[120px]" />
      <div class="absolute top-1/2 -left-40 w-[420px] h-[420px] rounded-full bg-neon-purple/[0.05] blur-[100px]" />
      <div class="absolute bottom-0 right-1/3 w-[360px] h-[360px] rounded-full bg-neon-mint/[0.04] blur-[90px]" />
    </div>

    <!-- top neon bar -->
    <div
      class="fixed top-16 left-0 right-0 z-10 h-[1px] bg-linear-to-r from-transparent via-neon-mint/40 to-transparent"
      aria-hidden="true"
    />

    <div class="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">

      <!-- ── page header ─────────────────────────────────────────────────── -->
      <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 animate-slide-left">
        <button
          type="button"
          aria-label="前のページに戻る"
          class="group flex items-center justify-center size-10 sm:size-11 rounded-xl border border-border/70 bg-surface-2/60 backdrop-blur-md hover:border-neon-mint/50 hover:bg-neon-mint/10 transition-all duration-300 touch-press shrink-0"
          @click="handleCancel"
        >
          <ArrowLeft
            class="w-4 h-4 text-muted-foreground group-hover:text-neon-mint transition-colors duration-300"
            aria-hidden="true"
          />
        </button>

        <div class="flex items-center gap-3 min-w-0">
          <div
            class="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-neon-mint/15 ring-1 ring-neon-mint/30 glow-mint shrink-0"
            aria-hidden="true"
          >
            <ArrowUpFromLine class="w-5 h-5 text-neon-mint" aria-hidden="true" />
          </div>
          <div class="min-w-0">
            <h1 class="font-display text-xl sm:text-2xl font-black tracking-[0.12em] text-foreground text-glow-mint leading-none">
              出金
            </h1>
            <p class="font-body text-[11px] sm:text-xs text-muted-foreground mt-0.5 tracking-wide">
              WITHDRAW FUNDS
            </p>
          </div>
        </div>
      </div>

      <!-- ── deposit / withdraw tab switcher ──────────────────────────────── -->
      <div
        class="relative flex rounded-2xl border border-border/60 bg-surface-2/40 backdrop-blur-md p-1 mb-8 sm:mb-10 animate-fade-up"
        role="tablist"
        aria-label="入出金切り替え"
      >
        <!-- sliding indicator (offset to withdraw side) -->
        <span
          class="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-neon-mint/15 border border-neon-mint/35 ring-1 ring-neon-mint/20 transition-transform duration-300 ease-[cubic-bezier(0.34,1.2,0.64,1)] pointer-events-none"
          :style="{ transform: 'translateX(calc(100% + 8px))' }"
          aria-hidden="true"
        />
        <!-- deposit tab -->
        <button
          type="button"
          role="tab"
          aria-selected="false"
          class="relative z-10 flex-1 flex items-center justify-center gap-2 h-10 rounded-xl font-display text-sm font-black tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors duration-200 touch-press"
          @click="router.push('/deposit')"
        >
          <ArrowDownToLine class="w-4 h-4 shrink-0" aria-hidden="true" />
          入金
        </button>
        <!-- withdraw tab (active) -->
        <button
          type="button"
          role="tab"
          aria-selected="true"
          aria-controls="withdraw-panel"
          class="relative z-10 flex-1 flex items-center justify-center gap-2 h-10 rounded-xl font-display text-sm font-black tracking-[0.1em] text-neon-mint transition-colors duration-200"
        >
          <ArrowUpFromLine class="w-4 h-4 shrink-0" aria-hidden="true" />
          出金
        </button>
      </div>

      <!-- ── success state ───────────────────────────────────────────────── -->
      <Transition name="scale-fade" mode="out-in">
        <div
          v-if="submitted"
          class="flex flex-col items-center gap-6 py-16 animate-fade-up text-center"
          role="status"
          aria-live="polite"
        >
          <div class="relative flex items-center justify-center size-20 rounded-full bg-neon-mint/10 ring-2 ring-neon-mint/40 glow-mint animate-pop-in">
            <CheckCircle2 class="w-10 h-10 text-neon-mint" aria-hidden="true" />
          </div>
          <div>
            <p class="font-display text-lg font-black tracking-widest text-neon-mint text-glow-mint mb-1">申請完了</p>
            <p class="font-body text-sm text-muted-foreground leading-relaxed">
              出金申請を受け付けました。<br>処理が完了次第、指定口座へ振り込まれます。
            </p>
          </div>
          <div class="glass-card rounded-2xl border border-neon-mint/20 px-6 py-4 flex flex-col gap-2 w-full max-w-xs">
            <div class="flex justify-between items-center text-sm">
              <span class="font-body text-muted-foreground">出金方法</span>
              <span class="font-body font-semibold text-foreground">{{ selectedMethod?.label }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="font-body text-muted-foreground">出金額</span>
              <span class="font-display font-black text-neon-mint text-glow-mint">
                ¥{{ numericAmount.toLocaleString('ja-JP') }}
              </span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="font-body text-muted-foreground">予估出款金額</span>
              <span class="font-display font-black text-yellow-400">
                ¥{{ estimatedPayout.toLocaleString('ja-JP') }}
              </span>
            </div>
          </div>
          <button
            type="button"
            class="font-body text-sm text-neon-mint hover:text-neon-purple transition-colors duration-200 underline underline-offset-4"
            @click="reset"
          >
            続けて出金する
          </button>
        </div>

        <!-- ── main form ───────────────────────────────────────────────── -->
        <form
          v-else
          id="withdraw-panel"
          novalidate
          class="flex flex-col gap-6 sm:gap-7 animate-fade-up"
          aria-label="出金フォーム"
          @submit.prevent="handleSubmit"
        >

          <!-- method selector label -->
          <section aria-labelledby="withdraw-method-label">
            <div class="flex items-center gap-2 mb-3">
              <span
                class="flex items-center justify-center size-5 rounded-full bg-neon-mint/20 ring-1 ring-neon-mint/40 font-display text-[10px] font-black text-neon-mint"
                aria-hidden="true"
              >1</span>
              <label
                id="withdraw-method-label"
                class="font-body text-sm font-semibold text-foreground tracking-wide"
              >
                出金方法を選択
              </label>
            </div>

            <!-- method cards (desktop) -->
            <div
              class="hidden sm:grid grid-cols-2 gap-3"
              role="radiogroup"
              aria-labelledby="withdraw-method-label"
            >
              <button
                v-for="m in methods"
                :key="m.id"
                type="button"
                role="radio"
                :aria-checked="selectedMethodId === m.id"
                :aria-label="`出金方法: ${m.label}`"
                :class="cn(
                  'relative group flex flex-col gap-2.5 p-4 rounded-2xl border text-left transition-all duration-300 touch-press overflow-hidden',
                  selectedMethodId === m.id
                    ? 'border-neon-mint/60 bg-neon-mint/10 ring-1 ring-neon-mint/30'
                    : 'border-border/70 bg-surface-2/50 hover:border-neon-mint/35 hover:bg-surface-2/80',
                )"
                @click="selectMethod(m.id)"
              >
                <span
                  :class="cn(
                    'absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-neon-mint transition-all duration-300',
                    selectedMethodId === m.id ? 'opacity-100' : 'opacity-0',
                  )"
                  aria-hidden="true"
                />
                <span
                  class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-neon-mint/[0.06] to-transparent group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                  aria-hidden="true"
                />

                <div class="flex items-center justify-between">
                  <div
                    :class="cn(
                      'flex items-center justify-center size-9 rounded-xl transition-all duration-300',
                      selectedMethodId === m.id
                        ? 'bg-neon-mint/20 ring-1 ring-neon-mint/40'
                        : 'bg-surface-3/70 ring-1 ring-border/60 group-hover:bg-neon-mint/10',
                    )"
                    aria-hidden="true"
                  >
                    <component :is="m.icon" :class="cn('w-4.5 h-4.5 transition-colors duration-300', methodIconColor[m.id])" aria-hidden="true" />
                  </div>
                  <span
                    :class="cn(
                      'size-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center',
                      selectedMethodId === m.id ? 'border-neon-mint bg-neon-mint/20' : 'border-border/60',
                    )"
                    aria-hidden="true"
                  >
                    <span
                      :class="cn(
                        'size-1.5 rounded-full bg-neon-mint transition-all duration-300',
                        selectedMethodId === m.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
                      )"
                    />
                  </span>
                </div>

                <div>
                  <p class="font-display text-[11px] font-black tracking-[0.12em] text-foreground leading-none mb-0.5">{{ m.label }}</p>
                  <p class="font-body text-[10px] text-muted-foreground">{{ m.labelEn }}</p>
                </div>

                <div class="flex items-center gap-3 pt-1 border-t border-border/40">
                  <div class="flex items-center gap-1">
                    <ShieldCheck class="w-3 h-3 text-muted-foreground/70 shrink-0" aria-hidden="true" />
                    <span class="font-body text-[10px] text-muted-foreground/80">手数料 {{ m.fee }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Info class="w-3 h-3 text-muted-foreground/70 shrink-0" aria-hidden="true" />
                    <span class="font-body text-[10px] text-muted-foreground/80">
                      最大 ¥{{ m.maxAmount.toLocaleString('ja-JP') }}
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <!-- method select dropdown (mobile) -->
            <div class="sm:hidden relative" @blur.capture="onSelectBlur">
              <button
                type="button"
                :aria-expanded="selectOpen"
                aria-haspopup="listbox"
                aria-controls="withdraw-method-listbox"
                aria-labelledby="withdraw-method-label"
                :class="cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border bg-surface-2/60 backdrop-blur-md transition-all duration-300 text-left group touch-press',
                  selectOpen
                    ? 'border-neon-mint/60 ring-1 ring-neon-mint/30'
                    : 'border-border/70 hover:border-neon-mint/40',
                )"
                @click="selectOpen = !selectOpen"
              >
                <div
                  :class="cn(
                    'flex items-center justify-center size-8 rounded-lg shrink-0 ring-1 transition-all duration-200',
                    'bg-neon-mint/15 ring-neon-mint/30',
                  )"
                  aria-hidden="true"
                >
                  <component :is="selectedMethod.icon" :class="cn('w-4 h-4', methodIconColor[selectedMethod.id])" aria-hidden="true" />
                </div>
                <span class="font-body text-sm font-semibold text-foreground flex-1 min-w-0 truncate">
                  {{ selectedMethod.label }}
                </span>
                <ChevronDown
                  :class="cn('w-4 h-4 text-muted-foreground transition-transform duration-300 shrink-0', selectOpen ? 'rotate-180' : '')"
                  aria-hidden="true"
                />
              </button>

              <Transition name="dropdown">
                <ul
                  v-if="selectOpen"
                  id="withdraw-method-listbox"
                  role="listbox"
                  aria-label="出金方法を選択"
                  data-select-panel
                  tabindex="-1"
                  class="absolute top-full left-0 right-0 mt-2 z-20 glass-card border border-neon-mint/25 rounded-2xl shadow-[0_8px_32px_-8px_oklch(0.88_0.15_174/0.35)] overflow-hidden"
                >
                  <li
                    v-for="m in methods"
                    :key="m.id"
                    role="option"
                    :aria-selected="selectedMethodId === m.id"
                    :class="cn(
                      'flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-200',
                      selectedMethodId === m.id
                        ? 'bg-neon-mint/15 text-neon-mint'
                        : 'text-foreground hover:bg-surface-3/80',
                    )"
                    @click="selectMethod(m.id)"
                  >
                    <div
                      :class="cn(
                        'flex items-center justify-center size-8 rounded-lg shrink-0 transition-all duration-200',
                        selectedMethodId === m.id ? 'bg-neon-mint/20 ring-1 ring-neon-mint/40' : 'bg-surface-3/60',
                      )"
                      aria-hidden="true"
                    >
                      <component :is="m.icon" :class="cn('w-4 h-4', methodIconColor[m.id])" aria-hidden="true" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-body text-sm font-semibold leading-none mb-0.5">{{ m.label }}</p>
                      <p class="font-body text-[10px] text-muted-foreground">手数料 {{ m.fee }}</p>
                    </div>
                    <Zap v-if="selectedMethodId === m.id" class="w-3.5 h-3.5 text-neon-mint shrink-0" aria-hidden="true" />
                  </li>
                </ul>
              </Transition>
            </div>
          </section>

          <!-- ── method info card ──────────────────────────────────────── -->
          <Transition name="slide-section">
            <div
              class="glass-card rounded-2xl border border-border/50 overflow-hidden animate-fade-up"
              aria-label="出金方式の詳細"
              role="region"
            >
              <!-- card header -->
              <div class="flex items-center gap-2.5 px-4 pt-4 pb-3 border-b border-border/40">
                <div
                  :class="cn(
                    'flex items-center justify-center size-7 rounded-lg bg-neon-mint/15 ring-1 ring-neon-mint/30 shrink-0',
                  )"
                  aria-hidden="true"
                >
                  <component :is="selectedMethod.icon" :class="cn('w-3.5 h-3.5', methodIconColor[selectedMethod.id])" aria-hidden="true" />
                </div>
                <span class="font-body text-xs text-muted-foreground">出款方式:</span>
                <span class="font-display text-sm font-black text-foreground tracking-wide">{{ selectedMethod.label }}</span>
              </div>

              <!-- stats grid -->
              <dl class="divide-y divide-border/30">
                <div class="flex justify-between items-center px-4 py-2.5">
                  <dt class="font-body text-xs text-muted-foreground">出金比值</dt>
                  <dd class="font-display text-xs font-black text-foreground tabular-nums">
                    {{ selectedMethod.exchangeRate.toFixed(2) }}
                  </dd>
                </div>
                <div class="flex justify-between items-center px-4 py-2.5">
                  <dt class="font-body text-xs text-muted-foreground">提現方式最小出金</dt>
                  <dd class="font-display text-xs font-black text-foreground tabular-nums">
                    {{ selectedMethod.minAmount.toLocaleString('ja-JP') }}.00
                  </dd>
                </div>
                <div class="flex justify-between items-center px-4 py-2.5">
                  <dt class="font-body text-xs text-muted-foreground">提現方式最大出金</dt>
                  <dd class="font-display text-xs font-black text-foreground tabular-nums">
                    {{ selectedMethod.maxAmount.toLocaleString('ja-JP') }}.00
                  </dd>
                </div>
                <div class="flex justify-between items-center px-4 py-2.5">
                  <dt class="font-body text-xs text-muted-foreground">提現手續費</dt>
                  <dd class="font-display text-xs font-black text-foreground tabular-nums">
                    {{ selectedMethod.fee }}
                  </dd>
                </div>
                <div class="flex justify-between items-center px-4 py-2.5">
                  <dt class="font-body text-xs text-muted-foreground">可用余額</dt>
                  <dd
                    :class="cn(
                      'font-display text-xs font-black tabular-nums',
                      selectedMethod.availableBalance > 0 ? 'text-neon-mint' : 'text-muted-foreground',
                    )"
                  >
                    {{ selectedMethod.availableBalance.toFixed(2) }}
                  </dd>
                </div>
              </dl>
            </div>
          </Transition>

          <!-- ── amount input ────────────────────────────────────────────── -->
          <section aria-labelledby="withdraw-amount-label" class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <span
                class="flex items-center justify-center size-5 rounded-full bg-neon-mint/20 ring-1 ring-neon-mint/40 font-display text-[10px] font-black text-neon-mint"
                aria-hidden="true"
              >2</span>
              <label
                id="withdraw-amount-label"
                for="withdraw-amount"
                class="font-body text-sm font-semibold text-foreground tracking-wide"
              >
                出金額を入力
              </label>
            </div>

            <div class="relative">
              <div
                :class="cn(
                  'relative flex items-center rounded-2xl border transition-all duration-300 overflow-hidden',
                  amountError
                    ? 'border-destructive/60 ring-1 ring-destructive/30'
                    : numericAmount > 0
                      ? 'border-neon-mint/55 ring-1 ring-neon-mint/25'
                      : 'border-border/70 focus-within:border-neon-mint/55 focus-within:ring-1 focus-within:ring-neon-mint/25',
                )"
              >
                <span
                  class="flex items-center justify-center h-full pl-4 pr-2 font-display text-lg font-black text-neon-mint shrink-0 select-none"
                  aria-hidden="true"
                >¥</span>

                <input
                  id="withdraw-amount"
                  ref="amountInputRef"
                  type="text"
                  inputmode="numeric"
                  autocomplete="off"
                  :value="numericAmount > 0 ? numericAmount.toLocaleString('ja-JP') : ''"
                  :placeholder="`請輸入金額`"
                  :aria-label="`出金額 (最低 ¥${selectedMethod.minAmount.toLocaleString('ja-JP')}、最大 ¥${selectedMethod.maxAmount.toLocaleString('ja-JP')})`"
                  :aria-invalid="!!amountError"
                  :aria-describedby="amountError ? 'withdraw-amount-error' : 'withdraw-amount-hint'"
                  class="flex-1 h-14 bg-transparent font-display text-2xl font-black text-foreground tracking-wide placeholder:text-muted-foreground/40 outline-none pr-4 tabular-nums"
                  @input="handleAmountInput"
                />

                <Transition name="fade-quick">
                  <button
                    v-if="numericAmount > 0"
                    type="button"
                    aria-label="金額をクリア"
                    class="flex items-center justify-center size-7 mr-3 rounded-full bg-surface-3/80 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all duration-200 touch-press shrink-0"
                    @click="rawAmount = ''"
                  >
                    <span class="font-body text-xs font-bold leading-none">✕</span>
                  </button>
                </Transition>
              </div>

              <Transition name="fade-quick">
                <p
                  v-if="amountError"
                  id="withdraw-amount-error"
                  role="alert"
                  class="flex items-center gap-1.5 mt-2 text-[11px] font-body text-destructive"
                >
                  <AlertCircle class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {{ amountError }}
                </p>
                <p
                  v-else
                  id="withdraw-amount-hint"
                  class="mt-2 text-[11px] font-body text-muted-foreground/70"
                >
                  最大 ¥{{ selectedMethod.maxAmount.toLocaleString('ja-JP') }}
                </p>
              </Transition>
            </div>

            <!-- estimated payout display -->
            <div
              :class="cn(
                'flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300',
                numericAmount > 0
                  ? 'border-neon-mint/20 bg-neon-mint/[0.06]'
                  : 'border-border/40 bg-surface-2/30',
              )"
              aria-label="予估出款金額"
            >
              <span class="font-body text-xs text-muted-foreground">預估出款金額</span>
              <div class="flex items-center gap-1.5">
                <span class="font-body text-xs text-muted-foreground/60">=</span>
                <span
                  :class="cn(
                    'font-display text-lg font-black tabular-nums transition-colors duration-300',
                    estimatedPayout > 0 ? 'text-yellow-400' : 'text-muted-foreground/50',
                  )"
                >
                  {{ estimatedPayout > 0 ? estimatedPayout.toLocaleString('ja-JP') : '0' }}
                </span>
              </div>
            </div>
          </section>

          <!-- ── CTA buttons ────────────────────────────────────────────── -->
          <div class="flex flex-col sm:flex-row gap-3 pt-1">
            <!-- cancel -->
            <button
              type="button"
              class="group relative flex-1 h-12 rounded-2xl border border-border/70 bg-surface-2/50 font-body text-sm font-semibold text-muted-foreground hover:border-neon-mint/35 hover:text-foreground hover:bg-surface-2/80 transition-all duration-300 touch-press overflow-hidden sm:max-w-[160px]"
              aria-label="出金をキャンセルして前のページに戻る"
              @click="handleCancel"
            >
              <span
                class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/[0.04] to-transparent group-hover:translate-x-full transition-transform duration-500 pointer-events-none"
                aria-hidden="true"
              />
              <span class="relative z-10 tracking-wide">キャンセル</span>
            </button>

            <!-- submit — gold gradient matching image -->
            <button
              type="submit"
              :disabled="!canSubmit || submitting"
              :aria-disabled="!canSubmit || submitting"
              :aria-busy="submitting"
              :class="cn(
                'group relative flex-1 h-12 rounded-2xl overflow-hidden font-display font-black text-sm tracking-[0.18em] transition-all duration-300',
                canSubmit && !submitting
                  ? 'bg-linear-to-r from-yellow-500 via-yellow-400 to-yellow-500 bg-[length:200%_100%] animate-border-slide text-black hover:brightness-110 hover:scale-[1.015] active:scale-[0.985] cursor-pointer shadow-[0_4px_24px_-4px_oklch(0.85_0.19_90/0.45)]'
                  : 'bg-surface-3 text-muted-foreground cursor-not-allowed',
              )"
              aria-label="出金を申請する"
            >
              <!-- shimmer sweep -->
              <span
                v-if="canSubmit && !submitting"
                class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/[0.25] to-transparent group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                aria-hidden="true"
              />
              <span v-if="!submitting" class="relative z-10 flex items-center justify-center gap-2">
                <Zap class="w-4 h-4 shrink-0" aria-hidden="true" />
                提交
              </span>
              <span
                v-else
                class="relative z-10 flex items-center justify-center gap-2"
                aria-live="polite"
                aria-label="処理中"
              >
                <Loader2 class="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                処理中...
              </span>
            </button>
          </div>

          <!-- screen reader status -->
          <p aria-live="polite" aria-atomic="true" class="sr-only">
            {{ submitting ? '出金処理中です。しばらくお待ちください。' : '' }}
          </p>

        </form>
      </Transition>

      <!-- security note -->
      <div
        v-if="!submitted"
        class="flex items-center justify-center gap-2 mt-8 text-[11px] font-body text-muted-foreground/60 animate-fade-up delay-300"
      >
        <ShieldCheck class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>全ての取引は256bit SSL暗号化で保護されています</span>
      </div>

    </div>
  </main>
</template>

<style scoped>
.dropdown-enter-active { transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1); }
.dropdown-leave-active { transition: opacity 0.14s ease, transform 0.14s ease; }
.dropdown-enter-from  { opacity: 0; transform: translateY(-6px) scale(0.97); }
.dropdown-leave-to    { opacity: 0; transform: translateY(-4px) scale(0.97); }

.slide-section-enter-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.2,0.64,1); }
.slide-section-leave-active { transition: opacity 0.2s ease; }
.slide-section-enter-from   { opacity: 0; transform: translateY(12px); }
.slide-section-leave-to     { opacity: 0; }

.scale-fade-enter-active { transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1); }
.scale-fade-leave-active { transition: opacity 0.2s ease; }
.scale-fade-enter-from   { opacity: 0; transform: scale(0.96); }
.scale-fade-leave-to     { opacity: 0; transform: scale(0.96); }

.fade-quick-enter-active { transition: opacity 0.15s ease; }
.fade-quick-leave-active { transition: opacity 0.1s ease; }
.fade-quick-enter-from,
.fade-quick-leave-to     { opacity: 0; }
</style>
