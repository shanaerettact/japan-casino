<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  X,
  Zap,
  User,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'

// ── props / emits ──────────────────────────────────────────────────────────
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

// ── form state ─────────────────────────────────────────────────────────────
const username    = ref('')
const password    = ref('')
const verifyCode  = ref('')
const showPass    = ref(false)
const submitting  = ref(false)
const submitted   = ref(false)

// captcha (mock 4-char code)
const captchaChars = ['N', 'K', '7', 'Z', 'A', '3', 'Q', 'V', 'X', '5', 'B', 'P']
function genCaptcha() {
  return Array.from({ length: 4 }, () => captchaChars[Math.floor(Math.random() * captchaChars.length)]).join('')
}
const captchaValue = ref(genCaptcha())
function refreshCaptcha() { captchaValue.value = genCaptcha() }

// ── validation ─────────────────────────────────────────────────────────────
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
  let score = 0
  if (v.length >= 8)  score++
  if (/[A-Z]/.test(v)) score++
  if (/[0-9]/.test(v)) score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  return score
})

const passwordLabel = computed(() => {
  const labels = ['', '弱い', '普通', '強い', '非常に強い']
  return labels[passwordStrength.value]
})

const strengthColors = [
  '',
  'bg-destructive',
  'bg-yellow-500',
  'bg-neon-mint',
  'bg-neon-mint',
]

const verifyError = computed(() => {
  if (!verifyCode.value) return ''
  if (verifyCode.value.toUpperCase() !== captchaValue.value) return '認証コードが正しくありません'
  return ''
})

const canSubmit = computed(() =>
  username.value.length >= 3 &&
  !usernameError.value &&
  password.value.length >= 6 &&
  verifyCode.value.toUpperCase() === captchaValue.value &&
  !submitting.value
)

// ── submit ─────────────────────────────────────────────────────────────────
async function handleSubmit() {
  if (!canSubmit.value) return
  submitting.value = true
  await new Promise(r => setTimeout(r, 1200))
  submitting.value = false
  submitted.value  = true
}

function close() {
  emit('close')
  setTimeout(() => {
    username.value   = ''
    password.value   = ''
    verifyCode.value = ''
    submitted.value  = false
    showPass.value   = false
    refreshCaptcha()
  }, 300)
}

// close on ESC
watch(() => props.open, (v) => {
  if (!v) return
  const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
  window.addEventListener('keydown', handler)
  setTimeout(() => window.removeEventListener('keydown', handler), 0)
})
</script>

<template>
  <Teleport to="body">
    <!-- backdrop -->
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
        @click.self="close"
      >
        <!-- blur overlay -->
        <div
          class="absolute inset-0 bg-background/70 backdrop-blur-md"
          aria-hidden="true"
          @click="close"
        />

        <!-- panel -->
        <div
          :class="cn(
            'relative z-10 w-full max-w-md',
            'rounded-3xl border border-neon-purple/30',
            'bg-surface-1/95 backdrop-blur-2xl',
            'shadow-[0_0_0_1px_oklch(0.62_0.28_305/0.10),0_32px_80px_-12px_oklch(0_0_0/0.7),0_0_80px_oklch(0.62_0.28_305/0.12)]',
          )"
        >
          <!-- top neon accent bar -->
          <div
            class="h-[2px] w-full rounded-t-3xl bg-linear-to-r from-neon-purple via-neon-mint to-neon-purple animate-neon-pulse"
            aria-hidden="true"
          />

          <!-- corner chrome -->
          <div class="absolute top-4 left-4 w-5 h-5 border-t border-l border-neon-mint/40 rounded-tl-lg pointer-events-none" aria-hidden="true" />
          <div class="absolute top-4 right-12 w-5 h-5 border-t border-r border-neon-purple/40 rounded-tr-lg pointer-events-none" aria-hidden="true" />
          <div class="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-neon-purple/40 rounded-bl-lg pointer-events-none" aria-hidden="true" />
          <div class="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-neon-mint/40 rounded-br-lg pointer-events-none" aria-hidden="true" />

          <!-- close button -->
          <button
            type="button"
            aria-label="閉じる"
            class="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/10 border border-transparent hover:border-neon-mint/25 transition-all duration-200 touch-press"
            @click="close"
          >
            <X class="w-4 h-4" aria-hidden="true" />
          </button>

          <!-- content -->
          <div class="px-6 pt-7 pb-7">

            <!-- ── success state ── -->
            <Transition name="success-fade" mode="out-in">
              <div v-if="submitted" key="success" class="flex flex-col items-center gap-5 py-8 text-center">
                <div class="relative">
                  <div class="w-20 h-20 rounded-full bg-neon-mint/15 flex items-center justify-center glow-mint">
                    <CheckCircle2 class="w-10 h-10 text-neon-mint" aria-hidden="true" />
                  </div>
                  <div class="absolute -inset-2 rounded-full border border-neon-mint/30 animate-neon-pulse" aria-hidden="true" />
                </div>
                <div>
                  <h2 class="font-display font-black text-2xl text-foreground text-glow-mint mb-2">登録完了！</h2>
                  <p class="font-body text-sm text-muted-foreground leading-relaxed">
                    ネコバースへようこそ！<br />
                    あなたのアカウントが作成されました。
                  </p>
                </div>
                <button
                  type="button"
                  :class="cn(
                    'mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl',
                    'font-display font-bold text-sm tracking-widest',
                    'bg-neon-purple text-primary-foreground glow-purple',
                    'hover:bg-neon-purple/85 transition-all duration-300 hover:scale-105 active:scale-95 touch-press',
                  )"
                  @click="close"
                >
                  プレイ開始
                  <ChevronRight class="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <!-- ── form state ── -->
              <div v-else key="form">
                <!-- header -->
                <div class="flex flex-col items-center gap-3 mb-7">
                  <!-- logo mark -->
                  <div class="relative">
                    <div class="w-14 h-14 rounded-2xl bg-neon-purple/20 border border-neon-purple/35 flex items-center justify-center glow-purple">
                      <Zap class="w-7 h-7 text-neon-mint" aria-hidden="true" />
                    </div>
                    <div class="absolute -inset-1 rounded-2xl border border-neon-purple/15 animate-neon-pulse" aria-hidden="true" />
                  </div>
                  <div class="text-center">
                    <h2
                      id="register-title"
                      class="font-display font-black text-xl tracking-[0.12em] text-foreground text-glow-purple"
                    >
                      NEKOVERSE
                    </h2>
                    <p class="font-body text-[11px] text-neon-mint tracking-widest font-semibold mt-0.5">
                      新規アカウント登録
                    </p>
                  </div>
                </div>

                <!-- form -->
                <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">

                  <!-- username -->
                  <div class="flex flex-col gap-1.5">
                    <label for="reg-username" class="font-body text-xs font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
                      <User class="w-3.5 h-3.5 text-neon-purple" aria-hidden="true" />
                      アカウントユーザー名
                    </label>
                    <div class="relative">
                      <input
                        id="reg-username"
                        v-model="username"
                        type="text"
                        autocomplete="username"
                        placeholder="例：ネコ侍_99"
                        maxlength="20"
                        :class="cn(
                          'w-full h-11 px-4 rounded-xl',
                          'bg-surface-2 border text-foreground text-sm font-body',
                          'placeholder:text-muted-foreground/50',
                          'outline-none transition-all duration-200',
                          'focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/60',
                          usernameError
                            ? 'border-destructive/70 ring-1 ring-destructive/30'
                            : username && !usernameError
                              ? 'border-neon-mint/50'
                              : 'border-border/80',
                        )"
                        aria-describedby="username-error"
                        :aria-invalid="!!usernameError"
                      />
                      <span
                        v-if="username && !usernameError"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-neon-mint"
                        aria-hidden="true"
                      >
                        <CheckCircle2 class="w-4 h-4" />
                      </span>
                    </div>
                    <p
                      v-if="usernameError"
                      id="username-error"
                      role="alert"
                      class="flex items-center gap-1 text-[11px] font-body text-destructive mt-0.5"
                    >
                      <AlertCircle class="w-3 h-3 shrink-0" aria-hidden="true" />
                      {{ usernameError }}
                    </p>
                  </div>

                  <!-- password -->
                  <div class="flex flex-col gap-1.5">
                    <label for="reg-password" class="font-body text-xs font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
                      <Lock class="w-3.5 h-3.5 text-neon-purple" aria-hidden="true" />
                      パスワード
                    </label>
                    <div class="relative">
                      <input
                        id="reg-password"
                        v-model="password"
                        :type="showPass ? 'text' : 'password'"
                        autocomplete="new-password"
                        placeholder="6文字以上"
                        :class="cn(
                          'w-full h-11 px-4 pr-10 rounded-xl',
                          'bg-surface-2 border text-foreground text-sm font-body',
                          'placeholder:text-muted-foreground/50',
                          'outline-none transition-all duration-200',
                          'focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/60',
                          'border-border/80',
                        )"
                      />
                      <button
                        type="button"
                        :aria-label="showPass ? 'パスワードを隠す' : 'パスワードを表示'"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-neon-mint transition-colors duration-200"
                        @click="showPass = !showPass"
                      >
                        <Eye v-if="!showPass" class="w-4 h-4" aria-hidden="true" />
                        <EyeOff v-else class="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    <!-- strength bar -->
                    <div v-if="password" class="flex flex-col gap-1">
                      <div class="flex gap-1" aria-hidden="true">
                        <div
                          v-for="i in 4"
                          :key="i"
                          :class="cn(
                            'h-1 flex-1 rounded-full transition-all duration-300',
                            i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-surface-3',
                          )"
                        />
                      </div>
                      <p class="text-[10px] font-body" :class="[passwordStrength >= 3 ? 'text-neon-mint' : passwordStrength >= 2 ? 'text-yellow-500' : 'text-destructive']">
                        強度: {{ passwordLabel }}
                      </p>
                    </div>
                  </div>

                  <!-- verification code -->
                  <div class="flex flex-col gap-1.5">
                    <label for="reg-verify" class="font-body text-xs font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
                      <ShieldCheck class="w-3.5 h-3.5 text-neon-purple" aria-hidden="true" />
                      認証コード
                    </label>
                    <div class="flex gap-2">
                      <div class="relative flex-1">
                        <input
                          id="reg-verify"
                          v-model="verifyCode"
                          type="text"
                          autocomplete="off"
                          placeholder="コードを入力"
                          maxlength="4"
                          :class="cn(
                            'w-full h-11 px-4 rounded-xl',
                            'bg-surface-2 border text-foreground text-sm font-body tracking-[0.25em] uppercase',
                            'placeholder:text-muted-foreground/50 placeholder:tracking-normal',
                            'outline-none transition-all duration-200',
                            'focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/60',
                            verifyError
                              ? 'border-destructive/70 ring-1 ring-destructive/30'
                              : verifyCode && !verifyError
                                ? 'border-neon-mint/50'
                                : 'border-border/80',
                          )"
                          aria-describedby="verify-error"
                          :aria-invalid="!!verifyError"
                        />
                      </div>

                      <!-- captcha display -->
                      <div
                        class="relative flex items-center justify-center w-28 h-11 rounded-xl border border-neon-purple/35 bg-surface-2 overflow-hidden select-none cursor-default shrink-0"
                        aria-label="認証コード画像"
                      >
                        <!-- scanline overlay -->
                        <div
                          class="absolute inset-0 opacity-25 pointer-events-none"
                          style="
                            background: repeating-linear-gradient(
                              0deg,
                              transparent,
                              transparent 3px,
                              oklch(0.62 0.28 305 / 0.3) 3px,
                              oklch(0.62 0.28 305 / 0.3) 4px
                            );
                          "
                          aria-hidden="true"
                        />
                        <!-- noise dots -->
                        <div class="absolute inset-0 opacity-15" aria-hidden="true"
                          style="background-image: radial-gradient(oklch(0.82 0.19 168) 1px, transparent 1px); background-size: 6px 6px;"
                        />
                        <span class="relative z-10 font-mono font-black text-base tracking-[0.3em] text-neon-mint text-glow-mint select-none pl-1">
                          {{ captchaValue }}
                        </span>
                        <button
                          type="button"
                          aria-label="認証コードを更新"
                          class="absolute bottom-1 right-1 text-muted-foreground/70 hover:text-neon-mint transition-colors duration-200"
                          @click="refreshCaptcha"
                        >
                          <RefreshCw class="w-2.5 h-2.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <p
                      v-if="verifyError"
                      id="verify-error"
                      role="alert"
                      class="flex items-center gap-1 text-[11px] font-body text-destructive mt-0.5"
                    >
                      <AlertCircle class="w-3 h-3 shrink-0" aria-hidden="true" />
                      {{ verifyError }}
                    </p>
                  </div>

                  <!-- divider -->
                  <div class="flex items-center gap-3 my-1" aria-hidden="true">
                    <div class="flex-1 h-[1px] bg-border/60" />
                    <span class="text-[10px] font-body text-muted-foreground tracking-widest">REGISTER</span>
                    <div class="flex-1 h-[1px] bg-border/60" />
                  </div>

                  <!-- submit / registration CTA -->
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
                      aria-label="アカウントを作成する"
                      :aria-busy="submitting"
                      :class="cn(
                        'group relative w-full h-12 rounded-[14px] overflow-hidden',
                        'font-display font-black text-sm tracking-[0.18em]',
                        'transition-all duration-300',
                        canSubmit
                          ? 'bg-neon-purple text-primary-foreground hover:bg-neon-purple/80 hover:scale-[1.015] active:scale-[0.985] cursor-pointer'
                          : 'bg-surface-3 text-muted-foreground cursor-not-allowed',
                      )"
                    >
                      <!-- idle state -->
                      <span
                        v-if="!submitting"
                        class="relative z-10 flex items-center justify-center gap-2"
                      >
                        <Zap class="w-4 h-4 shrink-0" aria-hidden="true" />
                        アカウントを作成
                        <ChevronRight class="w-4 h-4 shrink-0" aria-hidden="true" />
                      </span>

                      <!-- loading state -->
                      <span
                        v-else
                        class="relative z-10 flex items-center justify-center gap-2"
                        aria-live="polite"
                        aria-label="登録処理中"
                      >
                        <RefreshCw class="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                        処理中...
                      </span>

                      <!-- shimmer sweep (fires on group-hover) -->
                      <span
                        v-if="canSubmit"
                        class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/[0.12] to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"
                        aria-hidden="true"
                      />

                      <!-- inner mint glow edge -->
                      <span
                        v-if="canSubmit"
                        class="absolute inset-0 rounded-[14px] ring-1 ring-neon-mint/20 pointer-events-none"
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <!-- status live region for screen readers -->
                  <p
                    aria-live="polite"
                    aria-atomic="true"
                    class="sr-only"
                  >
                    {{ submitting ? '登録処理中です。しばらくお待ちください。' : '' }}
                  </p>

                  <!-- footer note -->
                  <p class="text-center text-[10px] font-body text-muted-foreground leading-relaxed">
                    登録することで、
                    <a href="#" class="text-neon-purple hover:underline underline-offset-2 transition-colors">利用規約</a>
                    および
                    <a href="#" class="text-neon-purple hover:underline underline-offset-2 transition-colors">プライバシーポリシー</a>
                    に同意したことになります。
                  </p>
                </form>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active {
  transition: opacity 0.25s ease;
}
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .relative.z-10,
.modal-fade-leave-active .relative.z-10 {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-fade-enter-from .relative.z-10 {
  opacity: 0;
  transform: scale(0.92) translateY(16px);
}
.modal-fade-leave-to .relative.z-10 {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}

.success-fade-enter-active,
.success-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.25s ease;
}
.success-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.success-fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
