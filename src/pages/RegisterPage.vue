<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Phone,
  MessageCircle,
  Gift,
  UserCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const router = useRouter()

// ── form state ─────────────────────────────────────────────────────
const username     = ref('')
const password     = ref('')
const confirmPass  = ref('')
const fullName     = ref('')
const phone        = ref('')
const lineId       = ref('')
const referralCode = ref('')
const verifyCode   = ref('')
const showPass     = ref(false)
const showConfirm  = ref(false)
const submitting   = ref(false)
const submitted    = ref(false)
const agreedTerms  = ref(false)

// ── captcha ─────────────────────────────────────────────────────────
const captchaChars = ['N','K','7','Z','A','3','Q','V','X','5','B','P','R','W','4','M']
function genCaptcha() {
  return Array.from({ length: 5 }, () =>
    captchaChars[Math.floor(Math.random() * captchaChars.length)]
  ).join('')
}
const captchaValue = ref(genCaptcha())
function refreshCaptcha() { captchaValue.value = genCaptcha() }

// ── validation ──────────────────────────────────────────────────────
const usernameError = computed(() => {
  if (!username.value) return ''
  if (username.value.length < 3) return 'ユーザー名は3文字以上必要です'
  if (username.value.length > 20) return '20文字以下で入力してください'
  if (!/^[a-zA-Z0-9_\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]+$/.test(username.value))
    return '使用できない文字が含まれています'
  return ''
})

const passwordStrength = computed(() => {
  const v = password.value
  if (!v) return 0
  let s = 0
  if (v.length >= 8)          s++
  if (/[A-Z]/.test(v))        s++
  if (/[0-9]/.test(v))        s++
  if (/[^A-Za-z0-9]/.test(v)) s++
  return s
})
const strengthLabel  = computed(() => (['', '弱い', '普通', '強い', '非常に強い'])[passwordStrength.value])
const strengthColors = ['', 'bg-destructive', 'bg-yellow-500', 'bg-neon-mint', 'bg-neon-mint']

const confirmError = computed(() => {
  if (!confirmPass.value) return ''
  if (confirmPass.value !== password.value) return 'パスワードが一致しません'
  return ''
})

const phoneError = computed(() => {
  if (!phone.value) return ''
  if (!/^[0-9+\-\s()]{7,20}$/.test(phone.value)) return '有効な電話番号を入力してください'
  return ''
})

const verifyError = computed(() => {
  if (!verifyCode.value) return ''
  if (verifyCode.value.toUpperCase() !== captchaValue.value) return '認証コードが正しくありません'
  return ''
})

const canSubmit = computed(() =>
  username.value.length >= 3 &&
  !usernameError.value &&
  password.value.length >= 6 &&
  confirmPass.value === password.value &&
  fullName.value.trim().length >= 1 &&
  phone.value.length >= 7 &&
  !phoneError.value &&
  verifyCode.value.toUpperCase() === captchaValue.value &&
  agreedTerms.value &&
  !submitting.value
)

// ── submit ──────────────────────────────────────────────────────────
async function handleSubmit() {
  if (!canSubmit.value) return
  submitting.value = true
  await new Promise(r => setTimeout(r, 1400))
  submitting.value = false
  submitted.value  = true
}

// step progress — cosmetic indicator
const steps = ['基本情報', 'セキュリティ', '確認'] as const
const currentStep = computed(() => {
  if (password.value && confirmPass.value === password.value) return 2
  if (username.value.length >= 3 && !usernameError.value && fullName.value) return 1
  return 0
})
</script>

<template>
  <main
    class="min-h-screen bg-background flex flex-col"
    aria-label="新規アカウント登録ページ"
  >
    <!-- ── ambient background glows ─────────────────────────── -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-neon-purple/[0.06] blur-[120px]" />
      <div class="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-neon-mint/[0.05] blur-[100px]" />
      <div class="absolute -bottom-32 left-1/4 w-[480px] h-[480px] rounded-full bg-neon-purple/[0.04] blur-[140px]" />
    </div>

    <!-- ── top bar ──────────────────────────────────────────── -->
    <header class="relative z-10 flex items-center justify-between px-4 sm:px-8 h-14 border-b border-border/40 bg-surface-1/60 backdrop-blur-md">
      <button
        type="button"
        class="flex items-center gap-1.5 text-muted-foreground hover:text-neon-mint transition-colors duration-200 font-body text-sm touch-press"
        aria-label="ホームに戻る"
        @click="router.push('/')"
      >
        <ChevronLeft class="w-4 h-4" aria-hidden="true" />
        ホームに戻る
      </button>

      <!-- logo -->
      <div class="flex items-center gap-2 select-none" aria-label="NEKOVERSE">
        <div class="w-7 h-7 rounded-lg bg-neon-purple/25 border border-neon-purple/40 flex items-center justify-center">
          <Zap class="w-4 h-4 text-neon-mint" aria-hidden="true" />
        </div>
        <span class="font-display font-black text-sm tracking-[0.18em] text-foreground text-glow-purple hidden sm:block">
          NEKOVERSE
        </span>
      </div>

      <!-- step indicator (desktop) -->
      <nav class="hidden sm:flex items-center gap-1" aria-label="登録ステップ">
        <template v-for="(step, i) in steps" :key="step">
          <div class="flex items-center gap-1">
            <div
              :class="cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-display font-black transition-all duration-300',
                i < currentStep
                  ? 'bg-neon-mint text-background'
                  : i === currentStep
                    ? 'bg-neon-purple text-primary-foreground glow-purple'
                    : 'bg-surface-3 text-muted-foreground',
              )"
              :aria-current="i === currentStep ? 'step' : undefined"
            >
              <CheckCircle2 v-if="i < currentStep" class="w-3.5 h-3.5" aria-hidden="true" />
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span
              :class="cn(
                'text-[10px] font-body transition-colors duration-300',
                i === currentStep ? 'text-foreground font-semibold' : 'text-muted-foreground',
              )"
            >{{ step }}</span>
          </div>
          <div v-if="i < steps.length - 1" class="w-6 h-[1px] bg-border/60 mx-0.5" aria-hidden="true" />
        </template>
      </nav>
    </header>

    <!-- ── page body ─────────────────────────────────────────── -->
    <div class="relative z-10 flex flex-1 items-start justify-center px-4 py-8 sm:py-12 pb-safe">
      <div class="w-full max-w-xl">

        <!-- ── success state ─────────────────────────────────── -->
        <Transition name="success-fade" mode="out-in">

          <div v-if="submitted" key="success" class="flex flex-col items-center gap-6 py-16 text-center">
            <div class="relative">
              <div class="w-24 h-24 rounded-full bg-neon-mint/15 flex items-center justify-center glow-mint animate-pop-in">
                <CheckCircle2 class="w-12 h-12 text-neon-mint" aria-hidden="true" />
              </div>
              <div class="absolute -inset-3 rounded-full border border-neon-mint/25 animate-neon-pulse" aria-hidden="true" />
            </div>
            <div class="animate-fade-up">
              <h1 class="font-display font-black text-3xl text-foreground text-glow-mint mb-3">
                登録完了！
              </h1>
              <p class="font-body text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                ネコバースへようこそ！<br />
                アカウントが正常に作成されました。<br />
                さっそくプレイを始めましょう。
              </p>
            </div>
            <button
              type="button"
              :class="cn(
                'mt-2 flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl',
                'font-display font-bold text-sm tracking-widest',
                'bg-neon-purple text-primary-foreground glow-purple',
                'hover:bg-neon-purple/85 hover:scale-105 active:scale-95',
                'transition-all duration-300 touch-press',
              )"
              @click="router.push('/')"
            >
              プレイ開始
              <ChevronRight class="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <!-- ── form ──────────────────────────────────────────── -->
          <div v-else key="form" class="animate-fade-up">

            <!-- header -->
            <div class="flex flex-col items-center gap-4 mb-8 text-center">
              <div class="relative">
                <div class="w-16 h-16 rounded-2xl bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center glow-purple">
                  <Zap class="w-8 h-8 text-neon-mint" aria-hidden="true" />
                </div>
                <div class="absolute -inset-1.5 rounded-2xl border border-neon-purple/15 animate-neon-pulse" aria-hidden="true" />
              </div>
              <div>
                <h1 class="font-display font-black text-2xl sm:text-3xl tracking-[0.12em] text-foreground text-glow-purple">
                  NEKOVERSE
                </h1>
                <p class="font-body text-xs text-neon-mint tracking-widest font-semibold mt-1">
                  新規アカウント登録
                </p>
              </div>
            </div>

            <!-- step progress (mobile) -->
            <nav class="flex sm:hidden items-center justify-center gap-1 mb-6" aria-label="登録ステップ">
              <template v-for="(step, i) in steps" :key="step">
                <div class="flex items-center gap-1">
                  <div
                    :class="cn(
                      'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-display font-black transition-all duration-300',
                      i < currentStep ? 'bg-neon-mint text-background' : i === currentStep ? 'bg-neon-purple text-primary-foreground' : 'bg-surface-3 text-muted-foreground',
                    )"
                  >
                    <CheckCircle2 v-if="i < currentStep" class="w-3 h-3" aria-hidden="true" />
                    <span v-else>{{ i + 1 }}</span>
                  </div>
                  <span :class="cn('text-[9px] font-body', i === currentStep ? 'text-foreground font-semibold' : 'text-muted-foreground')">{{ step }}</span>
                </div>
                <div v-if="i < steps.length - 1" class="w-4 h-[1px] bg-border/60 mx-0.5" aria-hidden="true" />
              </template>
            </nav>

            <!-- ── card ─────────────────────────────────────── -->
            <div
              class="rounded-3xl border border-neon-purple/25 bg-surface-1/90 backdrop-blur-2xl shadow-[0_0_0_1px_oklch(0.62_0.28_305/0.08),0_24px_60px_-8px_oklch(0_0_0/0.6),0_0_60px_oklch(0.62_0.28_305/0.08)]"
            >
              <!-- top neon bar -->
              <div class="h-[2px] w-full rounded-t-3xl bg-linear-to-r from-neon-purple via-neon-mint to-neon-purple animate-neon-pulse" aria-hidden="true" />

              <!-- corner chrome -->
              <div class="absolute top-[calc(3.5rem+2px)] left-3 w-5 h-5 border-t border-l border-neon-mint/30 rounded-tl-lg pointer-events-none" aria-hidden="true" />
              <div class="absolute top-[calc(3.5rem+2px)] right-3 w-5 h-5 border-t border-r border-neon-purple/30 rounded-tr-lg pointer-events-none" aria-hidden="true" />

              <form
                class="px-5 sm:px-8 pt-7 pb-8 flex flex-col gap-5"
                novalidate
                @submit.prevent="handleSubmit"
                aria-label="新規登録フォーム"
              >

                <!-- ── section: 基本情報 ── -->
                <fieldset class="flex flex-col gap-4">
                  <legend class="flex items-center gap-2 font-display text-[10px] font-black tracking-[0.22em] text-neon-mint mb-1">
                    <span class="w-4 h-[1px] bg-neon-mint/50" aria-hidden="true" />
                    基本情報
                    <span class="flex-1 h-[1px] bg-border/40" aria-hidden="true" />
                  </legend>

                  <!-- grid: username + fullname -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <!-- username -->
                    <div class="flex flex-col gap-1.5">
                      <label for="reg-username" class="flex items-center gap-1.5 font-body text-xs font-semibold text-muted-foreground tracking-wider">
                        <User class="w-3.5 h-3.5 text-neon-purple shrink-0" aria-hidden="true" />
                        アカウントユーザー名
                        <span class="text-destructive ml-0.5" aria-label="必須">*</span>
                      </label>
                      <div class="relative">
                        <input
                          id="reg-username"
                          v-model="username"
                          type="text"
                          autocomplete="username"
                          placeholder="例：ネコ侍_99"
                          maxlength="20"
                          :aria-invalid="!!usernameError"
                          aria-describedby="username-hint username-error"
                          :class="cn(
                            'w-full h-11 px-4 rounded-xl bg-surface-2 border text-foreground text-sm font-body',
                            'placeholder:text-muted-foreground/50 outline-none transition-all duration-200',
                            'focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/60',
                            usernameError ? 'border-destructive/70 ring-1 ring-destructive/30' : username && !usernameError ? 'border-neon-mint/50' : 'border-border/80',
                          )"
                        />
                        <CheckCircle2
                          v-if="username && !usernameError"
                          class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-mint"
                          aria-hidden="true"
                        />
                      </div>
                      <p id="username-hint" class="text-[10px] font-body text-muted-foreground/70">
                        3〜20文字（半角英数字・記号_・日本語可）
                      </p>
                      <p v-if="usernameError" id="username-error" role="alert" class="flex items-center gap-1 text-[11px] font-body text-destructive">
                        <AlertCircle class="w-3 h-3 shrink-0" aria-hidden="true" />
                        {{ usernameError }}
                      </p>
                    </div>

                    <!-- full name -->
                    <div class="flex flex-col gap-1.5">
                      <label for="reg-fullname" class="flex items-center gap-1.5 font-body text-xs font-semibold text-muted-foreground tracking-wider">
                        <UserCircle class="w-3.5 h-3.5 text-neon-purple shrink-0" aria-hidden="true" />
                        氏名（フルネーム）
                        <span class="text-destructive ml-0.5" aria-label="必須">*</span>
                      </label>
                      <div class="relative">
                        <input
                          id="reg-fullname"
                          v-model="fullName"
                          type="text"
                          autocomplete="name"
                          placeholder="例：山田 太郎"
                          :aria-invalid="fullName.length > 0 && fullName.trim().length === 0"
                          :class="cn(
                            'w-full h-11 px-4 rounded-xl bg-surface-2 border text-foreground text-sm font-body',
                            'placeholder:text-muted-foreground/50 outline-none transition-all duration-200',
                            'focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/60',
                            fullName.trim().length >= 1 ? 'border-neon-mint/50' : 'border-border/80',
                          )"
                        />
                        <CheckCircle2
                          v-if="fullName.trim().length >= 1"
                          class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-mint"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- phone -->
                  <div class="flex flex-col gap-1.5">
                    <label for="reg-phone" class="flex items-center gap-1.5 font-body text-xs font-semibold text-muted-foreground tracking-wider">
                      <Phone class="w-3.5 h-3.5 text-neon-purple shrink-0" aria-hidden="true" />
                      携帯電話番号
                      <span class="text-destructive ml-0.5" aria-label="必須">*</span>
                    </label>
                    <div class="relative">
                      <input
                        id="reg-phone"
                        v-model="phone"
                        type="tel"
                        autocomplete="tel"
                        placeholder="例：090-1234-5678"
                        :aria-invalid="!!phoneError"
                        aria-describedby="phone-error"
                        :class="cn(
                          'w-full h-11 px-4 rounded-xl bg-surface-2 border text-foreground text-sm font-body',
                          'placeholder:text-muted-foreground/50 outline-none transition-all duration-200',
                          'focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/60',
                          phoneError ? 'border-destructive/70 ring-1 ring-destructive/30' : phone && !phoneError ? 'border-neon-mint/50' : 'border-border/80',
                        )"
                      />
                      <CheckCircle2
                        v-if="phone && !phoneError"
                        class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-mint"
                        aria-hidden="true"
                      />
                    </div>
                    <p v-if="phoneError" id="phone-error" role="alert" class="flex items-center gap-1 text-[11px] font-body text-destructive">
                      <AlertCircle class="w-3 h-3 shrink-0" aria-hidden="true" />
                      {{ phoneError }}
                    </p>
                  </div>

                  <!-- grid: line + referral -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <!-- LINE ID -->
                    <div class="flex flex-col gap-1.5">
                      <label for="reg-line" class="flex items-center gap-1.5 font-body text-xs font-semibold text-muted-foreground tracking-wider">
                        <MessageCircle class="w-3.5 h-3.5 text-neon-purple shrink-0" aria-hidden="true" />
                        LINE ID
                        <span class="ml-auto text-[9px] font-body text-muted-foreground/60 tracking-normal">任意</span>
                      </label>
                      <input
                        id="reg-line"
                        v-model="lineId"
                        type="text"
                        autocomplete="off"
                        placeholder="例：neko_taro"
                        class="w-full h-11 px-4 rounded-xl bg-surface-2 border border-border/80 text-foreground text-sm font-body placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/60"
                      />
                    </div>

                    <!-- referral code -->
                    <div class="flex flex-col gap-1.5">
                      <label for="reg-referral" class="flex items-center gap-1.5 font-body text-xs font-semibold text-muted-foreground tracking-wider">
                        <Gift class="w-3.5 h-3.5 text-neon-purple shrink-0" aria-hidden="true" />
                        紹介コード
                        <span class="ml-auto text-[9px] font-body text-muted-foreground/60 tracking-normal">任意</span>
                      </label>
                      <input
                        id="reg-referral"
                        v-model="referralCode"
                        type="text"
                        autocomplete="off"
                        placeholder="例：NEKO2025"
                        class="w-full h-11 px-4 rounded-xl bg-surface-2 border border-border/80 text-foreground text-sm font-body placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/60 uppercase tracking-widest"
                      />
                    </div>
                  </div>
                </fieldset>

                <!-- ── section: セキュリティ ── -->
                <fieldset class="flex flex-col gap-4">
                  <legend class="flex items-center gap-2 font-display text-[10px] font-black tracking-[0.22em] text-neon-mint mb-1">
                    <span class="w-4 h-[1px] bg-neon-mint/50" aria-hidden="true" />
                    セキュリティ
                    <span class="flex-1 h-[1px] bg-border/40" aria-hidden="true" />
                  </legend>

                  <!-- password -->
                  <div class="flex flex-col gap-1.5">
                    <label for="reg-password" class="flex items-center gap-1.5 font-body text-xs font-semibold text-muted-foreground tracking-wider">
                      <Lock class="w-3.5 h-3.5 text-neon-purple shrink-0" aria-hidden="true" />
                      パスワード
                      <span class="text-destructive ml-0.5" aria-label="必須">*</span>
                    </label>
                    <div class="relative">
                      <input
                        id="reg-password"
                        v-model="password"
                        :type="showPass ? 'text' : 'password'"
                        autocomplete="new-password"
                        placeholder="6文字以上"
                        aria-describedby="password-strength-hint"
                        :class="cn(
                          'w-full h-11 px-4 pr-11 rounded-xl bg-surface-2 border text-foreground text-sm font-body',
                          'placeholder:text-muted-foreground/50 outline-none transition-all duration-200',
                          'focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/60 border-border/80',
                        )"
                      />
                      <button
                        type="button"
                        :aria-label="showPass ? 'パスワードを隠す' : 'パスワードを表示'"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-neon-mint transition-colors duration-200 p-0.5"
                        @click="showPass = !showPass"
                      >
                        <Eye v-if="!showPass" class="w-4 h-4" aria-hidden="true" />
                        <EyeOff v-else class="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div v-if="password" class="flex flex-col gap-1">
                      <div class="flex gap-1" role="img" :aria-label="`パスワード強度: ${strengthLabel}`">
                        <div
                          v-for="i in 4"
                          :key="i"
                          :class="cn('h-1 flex-1 rounded-full transition-all duration-300', i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-surface-3')"
                        />
                      </div>
                      <p
                        id="password-strength-hint"
                        class="text-[10px] font-body"
                        :class="passwordStrength >= 3 ? 'text-neon-mint' : passwordStrength >= 2 ? 'text-yellow-500' : 'text-destructive'"
                      >
                        強度: {{ strengthLabel }}
                      </p>
                    </div>
                  </div>

                  <!-- confirm password -->
                  <div class="flex flex-col gap-1.5">
                    <label for="reg-confirm" class="flex items-center gap-1.5 font-body text-xs font-semibold text-muted-foreground tracking-wider">
                      <Lock class="w-3.5 h-3.5 text-neon-purple shrink-0" aria-hidden="true" />
                      パスワード確認
                      <span class="text-destructive ml-0.5" aria-label="必須">*</span>
                    </label>
                    <div class="relative">
                      <input
                        id="reg-confirm"
                        v-model="confirmPass"
                        :type="showConfirm ? 'text' : 'password'"
                        autocomplete="new-password"
                        placeholder="パスワードを再入力"
                        :aria-invalid="!!confirmError"
                        aria-describedby="confirm-error"
                        :class="cn(
                          'w-full h-11 px-4 pr-11 rounded-xl bg-surface-2 border text-foreground text-sm font-body',
                          'placeholder:text-muted-foreground/50 outline-none transition-all duration-200',
                          'focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/60',
                          confirmError ? 'border-destructive/70 ring-1 ring-destructive/30' : confirmPass && !confirmError ? 'border-neon-mint/50' : 'border-border/80',
                        )"
                      />
                      <button
                        type="button"
                        :aria-label="showConfirm ? 'パスワードを隠す' : 'パスワードを表示'"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-neon-mint transition-colors duration-200 p-0.5"
                        @click="showConfirm = !showConfirm"
                      >
                        <Eye v-if="!showConfirm" class="w-4 h-4" aria-hidden="true" />
                        <EyeOff v-else class="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p v-if="confirmError" id="confirm-error" role="alert" class="flex items-center gap-1 text-[11px] font-body text-destructive">
                      <AlertCircle class="w-3 h-3 shrink-0" aria-hidden="true" />
                      {{ confirmError }}
                    </p>
                  </div>
                </fieldset>

                <!-- ── section: 確認 ── -->
                <fieldset class="flex flex-col gap-4">
                  <legend class="flex items-center gap-2 font-display text-[10px] font-black tracking-[0.22em] text-neon-mint mb-1">
                    <span class="w-4 h-[1px] bg-neon-mint/50" aria-hidden="true" />
                    確認
                    <span class="flex-1 h-[1px] bg-border/40" aria-hidden="true" />
                  </legend>

                  <!-- verification code -->
                  <div class="flex flex-col gap-1.5">
                    <label for="reg-verify" class="flex items-center gap-1.5 font-body text-xs font-semibold text-muted-foreground tracking-wider">
                      <ShieldCheck class="w-3.5 h-3.5 text-neon-purple shrink-0" aria-hidden="true" />
                      認証コード
                      <span class="text-destructive ml-0.5" aria-label="必須">*</span>
                    </label>
                    <div class="flex gap-3">
                      <div class="relative flex-1">
                        <input
                          id="reg-verify"
                          v-model="verifyCode"
                          type="text"
                          autocomplete="off"
                          placeholder="右のコードを入力"
                          maxlength="5"
                          :aria-invalid="!!verifyError"
                          aria-describedby="verify-error"
                          :class="cn(
                            'w-full h-11 px-4 rounded-xl bg-surface-2 border text-foreground text-sm font-body tracking-[0.3em] uppercase',
                            'placeholder:text-muted-foreground/50 placeholder:tracking-normal outline-none transition-all duration-200',
                            'focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/60',
                            verifyError ? 'border-destructive/70 ring-1 ring-destructive/30' : verifyCode && !verifyError ? 'border-neon-mint/50' : 'border-border/80',
                          )"
                        />
                      </div>
                      <!-- captcha display -->
                      <div
                        class="relative flex items-center justify-center w-32 h-11 rounded-xl border border-neon-purple/35 bg-surface-2 overflow-hidden select-none shrink-0"
                        aria-label="認証コード画像"
                        role="img"
                      >
                        <div
                          class="absolute inset-0 opacity-20 pointer-events-none"
                          style="background: repeating-linear-gradient(0deg, transparent, transparent 3px, oklch(0.62 0.28 305 / 0.3) 3px, oklch(0.62 0.28 305 / 0.3) 4px);"
                          aria-hidden="true"
                        />
                        <div class="absolute inset-0 opacity-12 pointer-events-none" style="background-image: radial-gradient(oklch(0.82 0.19 168) 1px, transparent 1px); background-size: 6px 6px;" aria-hidden="true" />
                        <span class="relative z-10 font-mono font-black text-base tracking-[0.32em] text-neon-mint text-glow-mint select-none pl-1">
                          {{ captchaValue }}
                        </span>
                        <button
                          type="button"
                          aria-label="認証コードを更新"
                          class="absolute bottom-1 right-1 text-muted-foreground/60 hover:text-neon-mint transition-colors duration-200"
                          @click="refreshCaptcha"
                        >
                          <RefreshCw class="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <p v-if="verifyError" id="verify-error" role="alert" class="flex items-center gap-1 text-[11px] font-body text-destructive">
                      <AlertCircle class="w-3 h-3 shrink-0" aria-hidden="true" />
                      {{ verifyError }}
                    </p>
                  </div>

                  <!-- terms checkbox -->
                  <label
                    for="reg-terms"
                    class="flex items-start gap-3 cursor-pointer group"
                    :class="agreedTerms ? '' : 'opacity-100'"
                  >
                    <div class="relative mt-0.5 shrink-0">
                      <input
                        id="reg-terms"
                        v-model="agreedTerms"
                        type="checkbox"
                        class="sr-only"
                        aria-required="true"
                      />
                      <div
                        :class="cn(
                          'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200',
                          agreedTerms
                            ? 'bg-neon-purple border-neon-purple'
                            : 'bg-surface-2 border-border/80 group-hover:border-neon-purple/50',
                        )"
                        aria-hidden="true"
                      >
                        <CheckCircle2 v-if="agreedTerms" class="w-3 h-3 text-primary-foreground" />
                      </div>
                    </div>
                    <span class="font-body text-xs text-muted-foreground leading-relaxed">
                      <a href="#" class="text-neon-purple hover:underline underline-offset-2 transition-colors">利用規約</a>
                      および
                      <a href="#" class="text-neon-purple hover:underline underline-offset-2 transition-colors">プライバシーポリシー</a>
                      に同意します
                    </span>
                  </label>
                </fieldset>

                <!-- ── submit button ── -->
                <div
                  :class="cn(
                    'relative rounded-2xl p-[1.5px] transition-all duration-300',
                    canSubmit
                      ? 'bg-linear-to-r from-neon-purple via-neon-mint/70 to-neon-purple bg-[length:200%_100%] animate-border-slide'
                      : 'bg-surface-3',
                  )"
                  aria-hidden="true"
                >
                  <button
                    type="submit"
                    :disabled="!canSubmit"
                    :aria-disabled="!canSubmit"
                    :aria-busy="submitting"
                    aria-label="アカウントを作成する"
                    :class="cn(
                      'group relative w-full h-13 rounded-[14px] overflow-hidden',
                      'font-display font-black text-sm tracking-[0.18em]',
                      'transition-all duration-300',
                      canSubmit
                        ? 'bg-neon-purple text-primary-foreground hover:bg-neon-purple/80 hover:scale-[1.015] active:scale-[0.985] cursor-pointer'
                        : 'bg-surface-3 text-muted-foreground cursor-not-allowed',
                    )"
                  >
                    <span v-if="!submitting" class="relative z-10 flex items-center justify-center gap-2">
                      <Zap class="w-4 h-4 shrink-0" aria-hidden="true" />
                      アカウントを作成
                      <ChevronRight class="w-4 h-4 shrink-0" aria-hidden="true" />
                    </span>
                    <span v-else class="relative z-10 flex items-center justify-center gap-2" aria-live="polite">
                      <RefreshCw class="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                      処理中...
                    </span>
                    <span
                      v-if="canSubmit"
                      class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/[0.12] to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"
                      aria-hidden="true"
                    />
                    <span
                      v-if="canSubmit"
                      class="absolute inset-0 rounded-[14px] ring-1 ring-neon-mint/20 pointer-events-none"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <!-- screen reader status -->
                <p aria-live="polite" aria-atomic="true" class="sr-only">
                  {{ submitting ? '登録処理中です。しばらくお待ちください。' : '' }}
                </p>

                <!-- footer -->
                <p class="text-center text-[11px] font-body text-muted-foreground leading-relaxed">
                  すでにアカウントをお持ちですか？
                  <button
                    type="button"
                    class="text-neon-purple hover:text-neon-mint transition-colors duration-200 font-semibold underline-offset-2 hover:underline"
                    @click="router.push('/')"
                  >
                    ログインはこちら
                  </button>
                </p>

              </form>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </main>
</template>

<style scoped>
.success-fade-enter-active,
.success-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.25s ease;
}
.success-fade-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(12px);
}
.success-fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

.h-13 {
  height: 3.25rem;
}
</style>
