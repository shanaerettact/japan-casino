<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  CreditCard,
  Building2,
  Bitcoin,
  Store,
  ChevronDown,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Clock,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const router = useRouter()

// ── deposit methods ────────────────────────────────────────────────────────
interface DepositMethod {
  id: string
  label: string
  labelEn: string
  icon: unknown
  minAmount: number
  maxAmount: number
  processingTime: string
  fee: string
  color: string
}

const methods: DepositMethod[] = [
  {
    id: 'bank',
    label: '銀行振込',
    labelEn: 'Bank Transfer',
    icon: Building2,
    minAmount: 1_000,
    maxAmount: 500_000,
    processingTime: '1〜3営業日',
    fee: '無料',
    color: 'neon-purple',
  },
  {
    id: 'credit',
    label: 'クレジットカード',
    labelEn: 'Credit Card',
    icon: CreditCard,
    minAmount: 1_000,
    maxAmount: 100_000,
    processingTime: '即時反映',
    fee: '3.6%',
    color: 'neon-mint',
  },
  {
    id: 'crypto',
    label: '暗号通貨',
    labelEn: 'Cryptocurrency',
    icon: Bitcoin,
    minAmount: 500,
    maxAmount: 1_000_000,
    processingTime: 'ネットワーク依存',
    fee: '無料',
    color: 'yellow-400',
  },
  {
    id: 'convenience',
    label: 'コンビニ払い',
    labelEn: 'Convenience Store',
    icon: Store,
    minAmount: 1_000,
    maxAmount: 49_000,
    processingTime: '数時間以内',
    fee: '無料',
    color: 'neon-purple',
  },
]

// ── state ──────────────────────────────────────────────────────────────────
const selectedMethodId = ref<string | null>(null)
const rawAmount = ref('')
const selectOpen = ref(false)
const amountError = ref('')
const submitting = ref(false)
const submitted = ref(false)
const amountInputRef = ref<HTMLInputElement | null>(null)

const selectedMethod = computed(() =>
  methods.find(m => m.id === selectedMethodId.value) ?? null,
)

const quickAmounts = [1_000, 3_000, 5_000, 10_000, 30_000, 50_000]

const numericAmount = computed(() => {
  const n = parseInt(rawAmount.value.replace(/,/g, ''), 10)
  return isNaN(n) ? 0 : n
})

const formattedAmount = computed(() =>
  numericAmount.value > 0 ? numericAmount.value.toLocaleString('ja-JP') : '',
)

const canSubmit = computed(() => {
  if (!selectedMethod.value) return false
  if (numericAmount.value <= 0) return false
  if (numericAmount.value < selectedMethod.value.minAmount) return false
  if (numericAmount.value > selectedMethod.value.maxAmount) return false
  return true
})

// live amount validation
watch(rawAmount, () => {
  if (!selectedMethod.value) { amountError.value = ''; return }
  const n = numericAmount.value
  if (n === 0) { amountError.value = ''; return }
  if (n < selectedMethod.value.minAmount)
    amountError.value = `最低入金額は ¥${selectedMethod.value.minAmount.toLocaleString('ja-JP')} です`
  else if (n > selectedMethod.value.maxAmount)
    amountError.value = `最大入金額は ¥${selectedMethod.value.maxAmount.toLocaleString('ja-JP')} です`
  else
    amountError.value = ''
})

// focus amount input when method selected
watch(selectedMethodId, async () => {
  amountError.value = ''
  await nextTick()
  amountInputRef.value?.focus()
})

function selectMethod(id: string) {
  selectedMethodId.value = id
  selectOpen.value = false
}

function applyQuick(amount: number) {
  rawAmount.value = amount.toString()
}

function handleAmountInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/[^\d]/g, '')
  rawAmount.value = raw
}

async function handleSubmit() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  await new Promise(r => setTimeout(r, 1600))
  submitting.value = false
  submitted.value = true
}

function handleCancel() {
  router.back()
}

function reset() {
  submitted.value = false
  selectedMethodId.value = null
  rawAmount.value = ''
  amountError.value = ''
}

// close select on outside click
function onSelectBlur(e: FocusEvent) {
  if (!(e.relatedTarget as HTMLElement)?.closest('[data-select-panel]'))
    selectOpen.value = false
}

const methodIconColor: Record<string, string> = {
  bank: 'text-neon-purple',
  credit: 'text-neon-mint',
  crypto: 'text-yellow-400',
  convenience: 'text-neon-purple',
}
</script>

<template>
  <main
    class="relative min-h-screen bg-background pt-16 pb-28 overflow-x-hidden"
    aria-label="入金ページ"
  >
    <!-- ambient background glows -->
    <div
      class="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div class="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-neon-purple/[0.07] blur-[120px]" />
      <div class="absolute top-1/2 -right-40 w-[420px] h-[420px] rounded-full bg-neon-mint/[0.05] blur-[100px]" />
      <div class="absolute bottom-0 left-1/3 w-[360px] h-[360px] rounded-full bg-neon-purple/[0.04] blur-[90px]" />
    </div>

    <!-- top neon bar -->
    <div
      class="fixed top-16 left-0 right-0 z-10 h-[1px] bg-linear-to-r from-transparent via-neon-purple/40 to-transparent"
      aria-hidden="true"
    />

    <div class="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">

      <!-- ── page header ─────────────────────────────────────────────────── -->
      <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 animate-slide-left">
        <button
          type="button"
          aria-label="前のページに戻る"
          class="group flex items-center justify-center size-10 sm:size-11 rounded-xl border border-border/70 bg-surface-2/60 backdrop-blur-md hover:border-neon-purple/50 hover:bg-neon-purple/10 transition-all duration-300 touch-press shrink-0"
          @click="handleCancel"
        >
          <ArrowLeft
            class="w-4 h-4 text-muted-foreground group-hover:text-neon-purple transition-colors duration-300"
            aria-hidden="true"
          />
        </button>

        <div class="flex items-center gap-3 min-w-0">
          <div
            class="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-neon-purple/15 ring-1 ring-neon-purple/30 glow-purple shrink-0"
            aria-hidden="true"
          >
            <Wallet class="w-5 h-5 text-neon-purple" aria-hidden="true" />
          </div>
          <div class="min-w-0">
            <h1 class="font-display text-xl sm:text-2xl font-black tracking-[0.12em] text-foreground text-glow-purple leading-none">
              入金
            </h1>
            <p class="font-body text-[11px] sm:text-xs text-muted-foreground mt-0.5 tracking-wide">
              DEPOSIT FUNDS
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
        <!-- sliding indicator -->
        <span
          class="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-neon-purple/20 border border-neon-purple/35 ring-1 ring-neon-purple/20 transition-transform duration-300 ease-[cubic-bezier(0.34,1.2,0.64,1)] pointer-events-none"
          :style="{ transform: 'translateX(0%)' }"
          aria-hidden="true"
        />
        <!-- deposit tab (active) -->
        <button
          type="button"
          role="tab"
          aria-selected="true"
          aria-controls="deposit-panel"
          class="relative z-10 flex-1 flex items-center justify-center gap-2 h-10 rounded-xl font-display text-sm font-black tracking-[0.1em] text-neon-purple transition-colors duration-200"
        >
          <ArrowDownToLine class="w-4 h-4 shrink-0" aria-hidden="true" />
          入金
        </button>
        <!-- withdraw tab -->
        <button
          type="button"
          role="tab"
          aria-selected="false"
          class="relative z-10 flex-1 flex items-center justify-center gap-2 h-10 rounded-xl font-display text-sm font-black tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors duration-200 touch-press"
          @click="router.push('/withdraw')"
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
          <div
            class="relative flex items-center justify-center size-20 rounded-full bg-neon-mint/10 ring-2 ring-neon-mint/40 glow-mint animate-pop-in"
          >
            <CheckCircle2 class="w-10 h-10 text-neon-mint" aria-hidden="true" />
          </div>
          <div>
            <p class="font-display text-lg font-black tracking-widest text-neon-mint text-glow-mint mb-1">
              申請完了
            </p>
            <p class="font-body text-sm text-muted-foreground leading-relaxed">
              入金申請を受け付けました。<br>処理が完了次第、残高へ反映されます。
            </p>
          </div>
          <div
            class="glass-card rounded-2xl border border-neon-mint/20 px-6 py-4 flex flex-col gap-2 w-full max-w-xs"
          >
            <div class="flex justify-between items-center text-sm">
              <span class="font-body text-muted-foreground">入金方法</span>
              <span class="font-body font-semibold text-foreground">{{ selectedMethod?.label }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="font-body text-muted-foreground">入金額</span>
              <span class="font-display font-black text-neon-mint text-glow-mint">¥{{ formattedAmount }}</span>
            </div>
          </div>
          <button
            type="button"
            class="font-body text-sm text-neon-purple hover:text-neon-mint transition-colors duration-200 underline underline-offset-4"
            @click="reset"
          >
            続けて入金する
          </button>
        </div>

        <!-- ── main form ───────────────────────────────────────────────── -->
        <form
          v-else
          novalidate
          class="flex flex-col gap-6 sm:gap-7 animate-fade-up"
          aria-label="入金フォーム"
          @submit.prevent="handleSubmit"
        >

          <!-- step 1 — method selector -->
          <section aria-labelledby="method-label">
            <div class="flex items-center gap-2 mb-3">
              <span
                class="flex items-center justify-center size-5 rounded-full bg-neon-purple/20 ring-1 ring-neon-purple/40 font-display text-[10px] font-black text-neon-purple"
                aria-hidden="true"
              >1</span>
              <label
                id="method-label"
                class="font-body text-sm font-semibold text-foreground tracking-wide"
              >
                入金方法を選択
              </label>
            </div>

            <!-- method cards (desktop) -->
            <div
              class="hidden sm:grid grid-cols-2 gap-3"
              role="radiogroup"
              aria-labelledby="method-label"
            >
              <button
                v-for="m in methods"
                :key="m.id"
                type="button"
                role="radio"
                :aria-checked="selectedMethodId === m.id"
                :aria-label="`入金方法: ${m.label}`"
                :class="cn(
                  'relative group flex flex-col gap-2.5 p-4 rounded-2xl border text-left transition-all duration-300 touch-press overflow-hidden',
                  selectedMethodId === m.id
                    ? 'border-neon-purple/60 bg-neon-purple/10 ring-1 ring-neon-purple/30'
                    : 'border-border/70 bg-surface-2/50 hover:border-neon-purple/35 hover:bg-surface-2/80',
                )"
                @click="selectMethod(m.id)"
              >
                <!-- active indicator bar -->
                <span
                  :class="cn(
                    'absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-neon-purple transition-all duration-300',
                    selectedMethodId === m.id ? 'opacity-100' : 'opacity-0',
                  )"
                  aria-hidden="true"
                />

                <!-- shimmer on hover -->
                <span
                  class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-neon-purple/[0.06] to-transparent group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                  aria-hidden="true"
                />

                <div class="flex items-center justify-between">
                  <div
                    :class="cn(
                      'flex items-center justify-center size-9 rounded-xl transition-all duration-300',
                      selectedMethodId === m.id
                        ? 'bg-neon-purple/20 ring-1 ring-neon-purple/40'
                        : 'bg-surface-3/70 ring-1 ring-border/60 group-hover:bg-neon-purple/10',
                    )"
                    aria-hidden="true"
                  >
                    <component
                      :is="m.icon"
                      :class="cn('w-4.5 h-4.5 transition-colors duration-300', methodIconColor[m.id])"
                      aria-hidden="true"
                    />
                  </div>
                  <!-- radio indicator -->
                  <span
                    :class="cn(
                      'size-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center',
                      selectedMethodId === m.id
                        ? 'border-neon-purple bg-neon-purple/20'
                        : 'border-border/60',
                    )"
                    aria-hidden="true"
                  >
                    <span
                      :class="cn(
                        'size-1.5 rounded-full bg-neon-purple transition-all duration-300',
                        selectedMethodId === m.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
                      )"
                    />
                  </span>
                </div>

                <div>
                  <p class="font-display text-[11px] font-black tracking-[0.12em] text-foreground leading-none mb-0.5">
                    {{ m.label }}
                  </p>
                  <p class="font-body text-[10px] text-muted-foreground">{{ m.labelEn }}</p>
                </div>

                <div class="flex items-center gap-3 pt-1 border-t border-border/40">
                  <div class="flex items-center gap-1">
                    <Clock class="w-3 h-3 text-muted-foreground/70 shrink-0" aria-hidden="true" />
                    <span class="font-body text-[10px] text-muted-foreground/80">{{ m.processingTime }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <ShieldCheck class="w-3 h-3 text-muted-foreground/70 shrink-0" aria-hidden="true" />
                    <span class="font-body text-[10px] text-muted-foreground/80">手数料 {{ m.fee }}</span>
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
                aria-controls="method-listbox"
                aria-labelledby="method-label"
                :class="cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border bg-surface-2/60 backdrop-blur-md transition-all duration-300 text-left group touch-press',
                  selectOpen
                    ? 'border-neon-purple/60 ring-1 ring-neon-purple/30'
                    : 'border-border/70 hover:border-neon-purple/40',
                )"
                @click="selectOpen = !selectOpen"
              >
                <template v-if="selectedMethod">
                  <div
                    class="flex items-center justify-center size-8 rounded-lg bg-neon-purple/15 ring-1 ring-neon-purple/30 shrink-0"
                    aria-hidden="true"
                  >
                    <component
                      :is="selectedMethod.icon"
                      :class="cn('w-4 h-4', methodIconColor[selectedMethod.id])"
                      aria-hidden="true"
                    />
                  </div>
                  <span class="font-body text-sm font-semibold text-foreground flex-1 min-w-0 truncate">
                    {{ selectedMethod.label }}
                  </span>
                </template>
                <template v-else>
                  <div
                    class="flex items-center justify-center size-8 rounded-lg bg-surface-3/60 ring-1 ring-border/40 shrink-0"
                    aria-hidden="true"
                  >
                    <Wallet class="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <span class="font-body text-sm text-muted-foreground flex-1">入金方法を選択してください</span>
                </template>
                <ChevronDown
                  :class="cn('w-4 h-4 text-muted-foreground transition-transform duration-300 shrink-0', selectOpen ? 'rotate-180' : '')"
                  aria-hidden="true"
                />
              </button>

              <Transition name="dropdown">
                <ul
                  v-if="selectOpen"
                  id="method-listbox"
                  role="listbox"
                  :aria-label="'入金方法を選択'"
                  data-select-panel
                  tabindex="-1"
                  class="absolute top-full left-0 right-0 mt-2 z-20 glass-card border border-neon-purple/25 rounded-2xl shadow-[0_8px_32px_-8px_oklch(0.62_0.28_305/0.35)] overflow-hidden"
                >
                  <li
                    v-for="m in methods"
                    :key="m.id"
                    role="option"
                    :aria-selected="selectedMethodId === m.id"
                    :class="cn(
                      'flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-200 group',
                      selectedMethodId === m.id
                        ? 'bg-neon-purple/15 text-neon-mint'
                        : 'text-foreground hover:bg-surface-3/80',
                    )"
                    @click="selectMethod(m.id)"
                  >
                    <div
                      :class="cn(
                        'flex items-center justify-center size-8 rounded-lg shrink-0 transition-all duration-200',
                        selectedMethodId === m.id ? 'bg-neon-purple/20 ring-1 ring-neon-purple/40' : 'bg-surface-3/60',
                      )"
                      aria-hidden="true"
                    >
                      <component :is="m.icon" :class="cn('w-4 h-4', methodIconColor[m.id])" aria-hidden="true" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-body text-sm font-semibold leading-none mb-0.5">{{ m.label }}</p>
                      <p class="font-body text-[10px] text-muted-foreground">{{ m.processingTime }} · {{ m.fee }}</p>
                    </div>
                    <Zap
                      v-if="selectedMethodId === m.id"
                      class="w-3.5 h-3.5 text-neon-mint shrink-0"
                      aria-hidden="true"
                    />
                  </li>
                </ul>
              </Transition>
            </div>
          </section>

          <!-- step 2 — amount (only shown after method selection) -->
          <Transition name="slide-section">
            <section
              v-if="selectedMethod"
              aria-labelledby="amount-label"
              class="flex flex-col gap-4"
            >
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="flex items-center justify-center size-5 rounded-full bg-neon-purple/20 ring-1 ring-neon-purple/40 font-display text-[10px] font-black text-neon-purple"
                  aria-hidden="true"
                >2</span>
                <label
                  id="amount-label"
                  for="deposit-amount"
                  class="font-body text-sm font-semibold text-foreground tracking-wide"
                >
                  入金額を入力
                </label>
              </div>

              <!-- method info bar -->
              <div
                class="flex items-center gap-4 px-4 py-2.5 rounded-xl bg-neon-purple/[0.07] border border-neon-purple/15"
              >
                <div class="flex items-center gap-1.5 text-[11px] font-body text-muted-foreground">
                  <ShieldCheck class="w-3.5 h-3.5 text-neon-purple shrink-0" aria-hidden="true" />
                  最低 ¥{{ selectedMethod.minAmount.toLocaleString('ja-JP') }}
                </div>
                <div class="w-px h-3.5 bg-border/60" aria-hidden="true" />
                <div class="flex items-center gap-1.5 text-[11px] font-body text-muted-foreground">
                  <Clock class="w-3.5 h-3.5 text-neon-purple shrink-0" aria-hidden="true" />
                  {{ selectedMethod.processingTime }}
                </div>
                <div class="w-px h-3.5 bg-border/60" aria-hidden="true" />
                <div class="flex items-center gap-1.5 text-[11px] font-body text-muted-foreground">
                  手数料 {{ selectedMethod.fee }}
                </div>
              </div>

              <!-- amount input -->
              <div class="relative">
                <div
                  :class="cn(
                    'relative flex items-center rounded-2xl border transition-all duration-300 overflow-hidden',
                    amountError
                      ? 'border-destructive/60 ring-1 ring-destructive/30'
                      : numericAmount > 0
                        ? 'border-neon-purple/55 ring-1 ring-neon-purple/25'
                        : 'border-border/70 focus-within:border-neon-purple/55 focus-within:ring-1 focus-within:ring-neon-purple/25',
                  )"
                >
                  <!-- yen prefix -->
                  <span
                    class="flex items-center justify-center h-full pl-4 pr-2 font-display text-lg font-black text-neon-purple shrink-0 select-none"
                    aria-hidden="true"
                  >¥</span>

                  <input
                    id="deposit-amount"
                    ref="amountInputRef"
                    type="text"
                    inputmode="numeric"
                    autocomplete="off"
                    :value="numericAmount > 0 ? numericAmount.toLocaleString('ja-JP') : ''"
                    :aria-label="`入金額 (最低 ¥${selectedMethod.minAmount.toLocaleString('ja-JP')}、最大 ¥${selectedMethod.maxAmount.toLocaleString('ja-JP')})`"
                    :aria-invalid="!!amountError"
                    :aria-describedby="amountError ? 'amount-error' : 'amount-hint'"
                    placeholder="0"
                    class="flex-1 h-14 bg-transparent font-display text-2xl font-black text-foreground tracking-wide placeholder:text-muted-foreground/40 outline-none pr-4 tabular-nums"
                    @input="handleAmountInput"
                  />

                  <!-- clear button -->
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

                <!-- error / hint -->
                <Transition name="fade-quick">
                  <p
                    v-if="amountError"
                    id="amount-error"
                    role="alert"
                    class="flex items-center gap-1.5 mt-2 text-[11px] font-body text-destructive"
                  >
                    <AlertCircle class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    {{ amountError }}
                  </p>
                  <p
                    v-else
                    id="amount-hint"
                    class="mt-2 text-[11px] font-body text-muted-foreground/70"
                  >
                    最大 ¥{{ selectedMethod.maxAmount.toLocaleString('ja-JP') }}
                  </p>
                </Transition>
              </div>

              <!-- quick-select amounts -->
              <div>
                <p class="font-body text-[11px] text-muted-foreground mb-2.5 tracking-wide">クイック選択</p>
                <div
                  class="grid grid-cols-3 gap-2"
                  role="group"
                  aria-label="クイック入金額選択"
                >
                  <button
                    v-for="amt in quickAmounts"
                    :key="amt"
                    type="button"
                    :aria-label="`¥${amt.toLocaleString('ja-JP')} を入力`"
                    :aria-pressed="numericAmount === amt"
                    :disabled="amt < selectedMethod.minAmount || amt > selectedMethod.maxAmount"
                    :class="cn(
                      'relative group flex flex-col items-center justify-center gap-0.5 h-14 rounded-xl border font-display text-sm font-black tracking-wide transition-all duration-300 touch-press overflow-hidden',
                      numericAmount === amt
                        ? 'border-neon-purple/60 bg-neon-purple/15 text-neon-purple ring-1 ring-neon-purple/30 glow-purple'
                        : (amt < selectedMethod.minAmount || amt > selectedMethod.maxAmount)
                          ? 'border-border/30 bg-surface-2/20 text-muted-foreground/30 cursor-not-allowed'
                          : 'border-border/60 bg-surface-2/50 text-foreground hover:border-neon-purple/45 hover:bg-neon-purple/10 hover:text-neon-purple',
                    )"
                    @click="applyQuick(amt)"
                  >
                    <!-- shimmer on hover -->
                    <span
                      class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-neon-purple/[0.08] to-transparent group-hover:translate-x-full transition-transform duration-500 pointer-events-none"
                      aria-hidden="true"
                    />
                    <span class="relative z-10 tabular-nums">
                      ¥{{ amt.toLocaleString('ja-JP') }}
                    </span>
                    <!-- active zap -->
                    <Zap
                      v-if="numericAmount === amt"
                      class="relative z-10 w-3 h-3 text-neon-mint"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <!-- summary card (when valid amount) -->
              <Transition name="slide-section">
                <div
                  v-if="canSubmit"
                  class="glass-card rounded-2xl border border-neon-mint/20 p-4 flex flex-col gap-2.5"
                  aria-label="入金サマリー"
                  role="region"
                >
                  <p class="font-display text-[10px] font-black tracking-[0.18em] text-muted-foreground">
                    SUMMARY
                  </p>
                  <div class="flex justify-between items-center">
                    <span class="font-body text-sm text-muted-foreground">入金方法</span>
                    <span class="font-body text-sm font-semibold text-foreground">{{ selectedMethod.label }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="font-body text-sm text-muted-foreground">入金額</span>
                    <span class="font-display text-base font-black text-neon-mint text-glow-mint">
                      ¥{{ formattedAmount }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="font-body text-sm text-muted-foreground">手数料</span>
                    <span class="font-body text-sm font-semibold text-foreground">{{ selectedMethod.fee }}</span>
                  </div>
                  <div class="h-px bg-border/50 my-0.5" aria-hidden="true" />
                  <div class="flex justify-between items-center">
                    <span class="font-body text-sm font-semibold text-foreground">入金完了予定</span>
                    <span class="font-body text-sm text-muted-foreground">{{ selectedMethod.processingTime }}</span>
                  </div>
                </div>
              </Transition>

              <!-- CTA buttons -->
              <div class="flex flex-col sm:flex-row gap-3 pt-2">
                <!-- cancel -->
                <button
                  type="button"
                  class="group relative flex-1 h-12 rounded-2xl border border-border/70 bg-surface-2/50 font-body text-sm font-semibold text-muted-foreground hover:border-neon-purple/35 hover:text-foreground hover:bg-surface-2/80 transition-all duration-300 touch-press overflow-hidden sm:max-w-[160px]"
                  aria-label="入金をキャンセルして前のページに戻る"
                  @click="handleCancel"
                >
                  <span
                    class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/[0.04] to-transparent group-hover:translate-x-full transition-transform duration-500 pointer-events-none"
                    aria-hidden="true"
                  />
                  <span class="relative z-10 tracking-wide">キャンセル</span>
                </button>

                <!-- submit -->
                <div
                  :class="cn(
                    'flex-1 relative rounded-2xl p-[1.5px] transition-all duration-300',
                    canSubmit
                      ? 'bg-linear-to-r from-neon-purple via-neon-mint/70 to-neon-purple bg-[length:200%_100%] animate-border-slide'
                      : 'bg-surface-3/60',
                  )"
                  aria-hidden="true"
                >
                  <button
                    type="submit"
                    :disabled="!canSubmit || submitting"
                    :aria-disabled="!canSubmit || submitting"
                    :aria-busy="submitting"
                    :class="cn(
                      'group relative w-full h-11 rounded-[14px] overflow-hidden font-display font-black text-sm tracking-[0.18em] transition-all duration-300',
                      canSubmit && !submitting
                        ? 'bg-neon-purple text-primary-foreground hover:bg-neon-purple/80 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                        : 'bg-surface-3 text-muted-foreground cursor-not-allowed',
                    )"
                    aria-label="入金を申請する"
                  >
                    <!-- shimmer -->
                    <span
                      v-if="canSubmit && !submitting"
                      class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/[0.12] to-transparent group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                      aria-hidden="true"
                    />
                    <span
                      v-if="!submitting"
                      class="relative z-10 flex items-center justify-center gap-2"
                    >
                      <Zap class="w-4 h-4 shrink-0" aria-hidden="true" />
                      入金申請
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
              </div>

              <!-- screen reader status -->
              <p aria-live="polite" aria-atomic="true" class="sr-only">
                {{ submitting ? '入金処理中です。しばらくお待ちください。' : '' }}
              </p>
            </section>
          </Transition>

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
/* dropdown slide */
.dropdown-enter-active { transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1); }
.dropdown-leave-active { transition: opacity 0.14s ease, transform 0.14s ease; }
.dropdown-enter-from  { opacity: 0; transform: translateY(-6px) scale(0.97); }
.dropdown-leave-to    { opacity: 0; transform: translateY(-4px) scale(0.97); }

/* section slide in */
.slide-section-enter-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.2,0.64,1); }
.slide-section-leave-active { transition: opacity 0.2s ease; }
.slide-section-enter-from   { opacity: 0; transform: translateY(12px); }
.slide-section-leave-to     { opacity: 0; }

/* scale-fade for success */
.scale-fade-enter-active { transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1); }
.scale-fade-leave-active { transition: opacity 0.2s ease; }
.scale-fade-enter-from   { opacity: 0; transform: scale(0.96); }
.scale-fade-leave-to     { opacity: 0; transform: scale(0.96); }

/* quick fade */
.fade-quick-enter-active { transition: opacity 0.15s ease; }
.fade-quick-leave-active { transition: opacity 0.1s ease; }
.fade-quick-enter-from,
.fade-quick-leave-to     { opacity: 0; }
</style>
