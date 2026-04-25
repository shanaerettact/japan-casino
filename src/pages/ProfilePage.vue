<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  Wallet,
  Crown,
  Landmark,
  Receipt,
  History,
  Settings,
  LogOut,
  ChevronRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  Star,
  Shield,
  Copy,
  CheckCheck,
  TrendingUp,
  Zap,
  User,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const router = useRouter()

// ── mock user data ──────────────────────────────────────────────────────────
const user = ref({
  nickname: 'ネコ侍',
  fullName: '山田 太郎',
  avatarInitial: 'ネ',
  memberId: 'NV-2841-KSTR',
  joinDate: '2024年3月',
  points: 48_250,
  totalDeposit: 320_000,
  totalWithdraw: 95_000,
  vipLevel: 3,
  vipName: 'GOLD',
  vipNextLevel: 'PLATINUM',
  vipProgress: 68,
  vipCurrentXP: 6_800,
  vipRequiredXP: 10_000,
  gamesPlayed: 1_247,
  winRate: 54.3,
})

const copied = ref(false)
function copyId() {
  navigator.clipboard.writeText(user.value.memberId).catch(() => {})
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function formatNum(n: number) {
  return n.toLocaleString('ja-JP')
}

// ── menu sections ───────────────────────────────────────────────────────────
interface MenuItem {
  label: string
  sublabel?: string
  icon: unknown
  to?: string
  accent: 'purple' | 'mint' | 'gold' | 'red'
  badge?: string
}

const accountItems: MenuItem[] = [
  {
    label: 'ウォレット',
    sublabel: `${formatNum(user.value.points)} pt 残高`,
    icon: Wallet,
    to: '/deposit',
    accent: 'purple',
  },
  {
    label: 'チャージ',
    sublabel: '入金・追加チャージ',
    icon: ArrowDownToLine,
    to: '/deposit',
    accent: 'purple',
  },
  {
    label: '出金',
    sublabel: '残高を引き出す',
    icon: ArrowUpFromLine,
    to: '/withdraw',
    accent: 'mint',
  },
  {
    label: 'VIPクラブ',
    sublabel: `${user.value.vipName} メンバー`,
    icon: Crown,
    to: '/vip',
    accent: 'gold',
    badge: user.value.vipName,
  },
]

const historyItems: MenuItem[] = [
  {
    label: '取引明細',
    sublabel: '入出金の履歴',
    icon: Receipt,
    to: '/account/billing',
    accent: 'purple',
  },
  {
    label: 'ゲーム記録',
    sublabel: `${formatNum(user.value.gamesPlayed)} プレイ済み`,
    icon: History,
    to: '/account/game-history',
    accent: 'mint',
  },
]

const settingsItems: MenuItem[] = [
  {
    label: '銀行口座設定',
    sublabel: '出金先の管理',
    icon: Landmark,
    to: '/account/bank',
    accent: 'mint',
  },
  {
    label: '設定',
    sublabel: 'セキュリティ・通知',
    icon: Settings,
    to: '/account/settings',
    accent: 'purple',
  },
]

// ── active nav state ─────────────────────────────────────────────────────────
const accentClasses: Record<string, { icon: string; bg: string; border: string; glow: string }> = {
  purple: {
    icon: 'text-neon-purple',
    bg: 'bg-neon-purple/12',
    border: 'border-neon-purple/25',
    glow: 'group-hover:glow-purple',
  },
  mint: {
    icon: 'text-neon-mint',
    bg: 'bg-neon-mint/12',
    border: 'border-neon-mint/25',
    glow: 'group-hover:glow-mint',
  },
  gold: {
    icon: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/25',
    glow: '',
  },
  red: {
    icon: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/25',
    glow: '',
  },
}

// ── logout ───────────────────────────────────────────────────────────────────
const logoutConfirm = ref(false)
function handleLogout() {
  if (!logoutConfirm.value) {
    logoutConfirm.value = true
    setTimeout(() => { logoutConfirm.value = false }, 3000)
    return
  }
  router.push('/')
}

const vipColors: Record<number, { from: string; to: string; label: string }> = {
  1: { from: 'from-zinc-400', to: 'to-zinc-300', label: 'SILVER' },
  2: { from: 'from-yellow-500', to: 'to-yellow-300', label: 'GOLD' },
  3: { from: 'from-yellow-500', to: 'to-yellow-300', label: 'GOLD' },
  4: { from: 'from-cyan-400', to: 'to-sky-300', label: 'PLATINUM' },
  5: { from: 'from-neon-purple', to: 'to-neon-mint', label: 'DIAMOND' },
}
const vipStyle = computed(() => vipColors[user.value.vipLevel] ?? vipColors[1])
</script>

<template>
  <main
    class="min-h-screen bg-background pt-20 pb-28 md:pb-16 relative overflow-x-hidden"
    aria-label="マイページ"
  >
    <!-- ambient glow blobs -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-neon-purple/[0.06] blur-[120px]" />
      <div class="absolute top-1/3 -right-40 w-[420px] h-[420px] rounded-full bg-neon-mint/[0.05] blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 space-y-5">

      <!-- ── page header ──────────────────────────────────────────────────── -->
      <div class="flex items-center gap-3 animate-slide-left">
        <button
          type="button"
          aria-label="前のページに戻る"
          class="group flex items-center justify-center size-10 sm:size-11 rounded-xl border border-border/70 bg-surface-2/60 backdrop-blur-md hover:border-neon-purple/50 hover:bg-neon-purple/10 transition-all duration-300 touch-press shrink-0"
          @click="router.back()"
        >
          <ArrowLeft class="w-4 h-4 text-muted-foreground group-hover:text-neon-purple transition-colors duration-300" aria-hidden="true" />
        </button>
        <div>
          <h1 class="font-display text-xl sm:text-2xl font-black tracking-[0.12em] text-foreground text-glow-purple leading-none">
            マイページ
          </h1>
          <p class="font-body text-[11px] sm:text-xs text-muted-foreground mt-0.5 tracking-wide">MY PROFILE</p>
        </div>
      </div>

      <!-- ── avatar + identity card ──────────────────────────────────────── -->
      <div
        class="relative rounded-2xl border border-border/60 bg-surface-1/70 backdrop-blur-md overflow-hidden animate-fade-up"
      >
        <!-- top gradient strip -->
        <div
          class="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-neon-purple via-neon-mint to-neon-purple"
          aria-hidden="true"
        />
        <!-- scanline texture -->
        <div class="absolute inset-0 scanline opacity-40 pointer-events-none" aria-hidden="true" />

        <div class="relative p-5 sm:p-6">
          <div class="flex items-start gap-4 sm:gap-5">
            <!-- avatar -->
            <div class="relative shrink-0">
              <div
                class="relative size-16 sm:size-20 rounded-2xl overflow-hidden ring-2 ring-neon-purple/40 glow-purple"
              >
                <div class="absolute inset-0 bg-linear-to-br from-neon-purple via-neon-purple/80 to-neon-mint/70" />
                <span class="relative flex size-full items-center justify-center font-display text-2xl sm:text-3xl font-black text-white select-none">
                  {{ user.avatarInitial }}
                </span>
              </div>
              <!-- VIP badge -->
              <span
                :class="cn(
                  'absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-display font-black tracking-widest text-black leading-none bg-linear-to-r',
                  vipStyle.from,
                  vipStyle.to,
                )"
                aria-label="`VIPレベル ${user.vipName}`"
              >
                {{ user.vipName }}
              </span>
            </div>

            <!-- info -->
            <div class="flex-1 min-w-0 pt-0.5">
              <h2 class="font-display text-base sm:text-lg font-black text-foreground tracking-wide truncate">
                {{ user.nickname }}
              </h2>
              <p class="font-body text-xs text-muted-foreground mt-0.5 truncate">{{ user.fullName }}</p>

              <!-- member ID -->
              <button
                type="button"
                class="mt-2 flex items-center gap-1.5 group/id touch-press"
                :aria-label="`会員ID ${user.memberId} をコピー`"
                @click="copyId"
              >
                <span class="font-mono text-[10px] text-muted-foreground/70 tracking-widest">{{ user.memberId }}</span>
                <Transition name="fade-icon" mode="out-in">
                  <CheckCheck v-if="copied" key="check" class="w-3 h-3 text-neon-mint shrink-0" aria-hidden="true" />
                  <Copy v-else key="copy" class="w-3 h-3 text-muted-foreground/50 group-hover/id:text-neon-purple transition-colors shrink-0" aria-hidden="true" />
                </Transition>
              </button>

              <p class="font-body text-[10px] text-muted-foreground/50 mt-1">登録: {{ user.joinDate }}</p>
            </div>
          </div>

          <!-- ── stats row ──────────────────────────────────────────────── -->
          <div class="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            <div
              v-for="stat in [
                { label: 'ポイント', value: formatNum(user.points), unit: 'pt', icon: Zap, color: 'text-neon-purple' },
                { label: '勝率', value: user.winRate + '%', unit: '', icon: TrendingUp, color: 'text-neon-mint' },
                { label: 'ゲーム数', value: formatNum(user.gamesPlayed), unit: '回', icon: Star, color: 'text-yellow-400' },
              ]"
              :key="stat.label"
              class="flex flex-col items-center justify-center gap-1 rounded-xl border border-border/50 bg-surface-2/50 py-3 px-2 text-center"
            >
              <component :is="stat.icon" :class="cn('w-3.5 h-3.5', stat.color)" aria-hidden="true" />
              <span class="font-display text-sm sm:text-base font-black text-foreground tabular-nums leading-none">
                {{ stat.value }}
              </span>
              <span class="font-body text-[9px] text-muted-foreground tracking-wide">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── VIP progress card ────────────────────────────────────────────── -->
      <div
        class="relative rounded-2xl border border-yellow-500/25 bg-surface-1/70 backdrop-blur-md overflow-hidden animate-fade-up delay-100"
      >
        <div class="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-yellow-500 via-yellow-300 to-yellow-500" aria-hidden="true" />
        <div class="p-4 sm:p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="flex items-center justify-center size-8 rounded-lg bg-yellow-400/15 border border-yellow-400/25">
                <Crown class="w-4 h-4 text-yellow-400" aria-hidden="true" />
              </div>
              <div>
                <p class="font-display text-xs font-black tracking-widest text-yellow-400">VIPクラブ</p>
                <p class="font-body text-[10px] text-muted-foreground">{{ user.vipName }} → {{ user.vipNextLevel }}</p>
              </div>
            </div>
            <button
              type="button"
              class="flex items-center gap-1 font-body text-[10px] text-yellow-400/80 hover:text-yellow-400 transition-colors touch-press"
              aria-label="VIPクラブの詳細ページへ"
              @click="router.push('/vip')"
            >
              詳細
              <ChevronRight class="w-3 h-3" aria-hidden="true" />
            </button>
          </div>

          <!-- progress bar -->
          <div class="space-y-1.5">
            <div class="flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>{{ formatNum(user.vipCurrentXP) }} XP</span>
              <span>{{ formatNum(user.vipRequiredXP) }} XP</span>
            </div>
            <div
              class="relative h-2.5 rounded-full bg-surface-3/80 overflow-hidden border border-border/40"
              role="progressbar"
              :aria-valuenow="user.vipProgress"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-label="`VIP進捗 ${user.vipProgress}%`"
            >
              <div
                class="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-yellow-500 to-yellow-300 transition-all duration-1000 ease-out"
                :style="{ width: user.vipProgress + '%' }"
              >
                <!-- shimmer -->
                <span class="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" aria-hidden="true" />
              </div>
            </div>
            <p class="font-body text-[9px] text-muted-foreground text-right">
              {{ user.vipProgress }}% 完了
            </p>
          </div>
        </div>
      </div>

      <!-- ── account section ─────────────────────────────────────────────── -->
      <section aria-labelledby="account-heading" class="animate-fade-up delay-200">
        <h2
          id="account-heading"
          class="font-display text-[10px] font-black tracking-[0.25em] text-muted-foreground mb-2 px-1 uppercase"
        >
          アカウント
        </h2>
        <div class="rounded-2xl border border-border/50 bg-surface-1/60 backdrop-blur-md overflow-hidden">
          <ul role="list" class="divide-y divide-border/40">
            <li v-for="(item, i) in accountItems" :key="item.label">
              <button
                type="button"
                class="group w-full flex items-center gap-3 px-4 py-3.5 sm:py-4 hover:bg-surface-2/60 transition-all duration-200 touch-press text-left"
                :aria-label="`${item.label}ページへ`"
                @click="item.to && router.push(item.to)"
              >
                <!-- icon -->
                <div
                  :class="cn(
                    'flex items-center justify-center size-9 rounded-xl border shrink-0 transition-all duration-300',
                    accentClasses[item.accent].bg,
                    accentClasses[item.accent].border,
                    accentClasses[item.accent].glow,
                  )"
                >
                  <component
                    :is="item.icon"
                    :class="cn('w-4 h-4', accentClasses[item.accent].icon)"
                    aria-hidden="true"
                  />
                </div>

                <!-- label -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-body text-sm font-semibold text-foreground group-hover:text-neon-purple transition-colors duration-200">
                      {{ item.label }}
                    </span>
                    <span
                      v-if="item.badge"
                      :class="cn(
                        'px-1.5 py-0.5 rounded text-[9px] font-display font-black tracking-widest text-black leading-none bg-linear-to-r',
                        vipStyle.from,
                        vipStyle.to,
                      )"
                    >
                      {{ item.badge }}
                    </span>
                  </div>
                  <p v-if="item.sublabel" class="font-body text-[11px] text-muted-foreground mt-0.5 truncate">
                    {{ item.sublabel }}
                  </p>
                </div>

                <ChevronRight
                  class="w-4 h-4 text-muted-foreground/50 group-hover:text-neon-purple group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
                  aria-hidden="true"
                />
              </button>
            </li>
          </ul>
        </div>
      </section>

      <!-- ── history section ─────────────────────────────────────────────── -->
      <section aria-labelledby="history-heading" class="animate-fade-up delay-300">
        <h2
          id="history-heading"
          class="font-display text-[10px] font-black tracking-[0.25em] text-muted-foreground mb-2 px-1 uppercase"
        >
          履歴・記録
        </h2>
        <div class="rounded-2xl border border-border/50 bg-surface-1/60 backdrop-blur-md overflow-hidden">
          <ul role="list" class="divide-y divide-border/40">
            <li v-for="item in historyItems" :key="item.label">
              <button
                type="button"
                class="group w-full flex items-center gap-3 px-4 py-3.5 sm:py-4 hover:bg-surface-2/60 transition-all duration-200 touch-press text-left"
                :aria-label="`${item.label}ページへ`"
                @click="item.to && router.push(item.to)"
              >
                <div
                  :class="cn(
                    'flex items-center justify-center size-9 rounded-xl border shrink-0 transition-all duration-300',
                    accentClasses[item.accent].bg,
                    accentClasses[item.accent].border,
                    accentClasses[item.accent].glow,
                  )"
                >
                  <component
                    :is="item.icon"
                    :class="cn('w-4 h-4', accentClasses[item.accent].icon)"
                    aria-hidden="true"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <span class="font-body text-sm font-semibold text-foreground group-hover:text-neon-mint transition-colors duration-200">
                    {{ item.label }}
                  </span>
                  <p v-if="item.sublabel" class="font-body text-[11px] text-muted-foreground mt-0.5 truncate">
                    {{ item.sublabel }}
                  </p>
                </div>
                <ChevronRight
                  class="w-4 h-4 text-muted-foreground/50 group-hover:text-neon-mint group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
                  aria-hidden="true"
                />
              </button>
            </li>
          </ul>
        </div>
      </section>

      <!-- ── settings section ────────────────────────────────────────────── -->
      <section aria-labelledby="settings-heading" class="animate-fade-up delay-400">
        <h2
          id="settings-heading"
          class="font-display text-[10px] font-black tracking-[0.25em] text-muted-foreground mb-2 px-1 uppercase"
        >
          設定
        </h2>
        <div class="rounded-2xl border border-border/50 bg-surface-1/60 backdrop-blur-md overflow-hidden">
          <ul role="list" class="divide-y divide-border/40">
            <li v-for="item in settingsItems" :key="item.label">
              <button
                type="button"
                class="group w-full flex items-center gap-3 px-4 py-3.5 sm:py-4 hover:bg-surface-2/60 transition-all duration-200 touch-press text-left"
                :aria-label="`${item.label}ページへ`"
                @click="item.to && router.push(item.to)"
              >
                <div
                  :class="cn(
                    'flex items-center justify-center size-9 rounded-xl border shrink-0 transition-all duration-300',
                    accentClasses[item.accent].bg,
                    accentClasses[item.accent].border,
                    accentClasses[item.accent].glow,
                  )"
                >
                  <component
                    :is="item.icon"
                    :class="cn('w-4 h-4', accentClasses[item.accent].icon)"
                    aria-hidden="true"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <span class="font-body text-sm font-semibold text-foreground group-hover:text-neon-purple transition-colors duration-200">
                    {{ item.label }}
                  </span>
                  <p v-if="item.sublabel" class="font-body text-[11px] text-muted-foreground mt-0.5 truncate">
                    {{ item.sublabel }}
                  </p>
                </div>
                <ChevronRight
                  class="w-4 h-4 text-muted-foreground/50 group-hover:text-neon-purple group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
                  aria-hidden="true"
                />
              </button>
            </li>
          </ul>
        </div>
      </section>

      <!-- ── security badge ──────────────────────────────────────────────── -->
      <div
        class="flex items-center gap-3 px-4 py-3 rounded-xl border border-neon-mint/20 bg-neon-mint/[0.05] animate-fade-up delay-500"
      >
        <Shield class="w-4 h-4 text-neon-mint shrink-0" aria-hidden="true" />
        <p class="font-body text-[11px] text-muted-foreground leading-relaxed">
          アカウントは<span class="text-neon-mint font-semibold">SSL 暗号化</span>で保護されています。
        </p>
      </div>

      <!-- ── logout ──────────────────────────────────────────────────────── -->
      <div class="animate-fade-up delay-500">
        <button
          type="button"
          :class="cn(
            'group w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl border font-display text-sm font-black tracking-[0.12em] transition-all duration-300 touch-press',
            logoutConfirm
              ? 'border-destructive/60 bg-destructive/15 text-destructive hover:bg-destructive/25'
              : 'border-border/60 bg-surface-2/40 text-muted-foreground hover:border-destructive/40 hover:text-destructive hover:bg-destructive/10',
          )"
          :aria-label="logoutConfirm ? 'もう一度クリックして確定ログアウト' : 'ログアウト'"
          @click="handleLogout"
        >
          <LogOut
            :class="cn(
              'w-4 h-4 shrink-0 transition-all duration-300',
              logoutConfirm ? 'text-destructive' : 'text-muted-foreground group-hover:text-destructive',
            )"
            aria-hidden="true"
          />
          <span>{{ logoutConfirm ? 'もう一度クリックして確定' : 'ログアウト' }}</span>
        </button>
        <p
          v-if="logoutConfirm"
          class="text-center font-body text-[10px] text-destructive/70 mt-1.5"
          aria-live="polite"
        >
          もう一度押すとログアウトします
        </p>
      </div>

      <!-- bottom padding for mobile nav bar -->
      <div class="h-4" aria-hidden="true" />
    </div>
  </main>
</template>

<style scoped>
/* fade icon transition for copy / check */
.fade-icon-enter-active,
.fade-icon-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-icon-enter-from {
  opacity: 0;
  transform: scale(0.7);
}
.fade-icon-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

/* shimmer on VIP progress bar */
@keyframes shimmer {
  from { transform: translateX(-100%); }
  to   { transform: translateX(200%); }
}
.animate-shimmer {
  animation: shimmer 2.2s ease-in-out infinite;
}
</style>
