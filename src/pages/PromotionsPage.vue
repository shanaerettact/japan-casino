<script setup lang="ts">
import { ref, computed } from 'vue'
import { Gift, Zap, Star, Clock, Trophy, Flame, Tag, ChevronRight, ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const tabs = computed(() => [
  { label: t('promotions.tabAll'),      value: 'all' },
  { label: t('promotions.tabNew'),      value: 'new' },
  { label: t('promotions.tabDeposit'),  value: 'deposit' },
  { label: t('promotions.tabCashback'), value: 'cashback' },
  { label: t('promotions.tabLimited'),  value: 'limited' },
])
const activeTab = ref('all')

interface Promo {
  id: number
  tag: string
  type: string
  title: string
  desc: string
  bonus: string
  expiry: string
  icon: unknown
  image: string
  accentFrom: string
  accentTo: string
  glowClass: string
  variantClass: string
  hot?: boolean
  new?: boolean
}

const promotions: Promo[] = [
  {
    id: 1,
    tag: 'new',
    type: 'New Member',
    title: 'Welcome Bonus',
    desc: 'First deposit matched up to $8,888. Kick off your journey with a massive head start.',
    bonus: '100% up to $8,888',
    expiry: 'Permanent',
    icon: Gift,
    image: '/images/promo/1778570894962.jpeg',
    accentFrom: 'from-neon-purple',
    accentTo: 'to-neon-mint',
    glowClass: 'glow-purple',
    variantClass: 'border-neon-purple/25 hover:border-neon-purple/55 [box-shadow:0_0_22px_-5px_oklch(0.62_0.28_305/0.22)] hover:[box-shadow:0_0_32px_-4px_oklch(0.62_0.28_305/0.38)]',
    hot: true,
  },
  {
    id: 2,
    tag: 'deposit',
    type: 'Daily Deposit',
    title: 'Daily Reload',
    desc: 'Earn a 20% bonus every time you top up. The more you deposit, the more you gain.',
    bonus: '20% Daily Reload',
    expiry: 'Daily',
    icon: Zap,
    image: '/images/promo/1778571686152.jpeg',
    accentFrom: 'from-neon-mint',
    accentTo: 'to-neon-purple',
    glowClass: 'glow-mint',
    variantClass: 'border-neon-mint/25 hover:border-neon-mint/55 [box-shadow:0_0_22px_-5px_oklch(0.82_0.19_168/0.22)] hover:[box-shadow:0_0_32px_-4px_oklch(0.82_0.19_168/0.38)]',
    new: true,
  },
  {
    id: 3,
    tag: 'cashback',
    type: 'Cashback',
    title: 'Weekly Rescue',
    desc: 'Get 10% cashback on your net losses every week — auto-credited every Monday.',
    bonus: '10% Weekly Cashback',
    expiry: 'Every Monday',
    icon: Trophy,
    image: '/images/promo/1778661200483.jpeg',
    accentFrom: 'from-amber-500',
    accentTo: 'to-neon-purple',
    glowClass: 'glow-purple',
    variantClass: 'border-amber-500/25 hover:border-amber-500/55 [box-shadow:0_0_22px_-5px_rgba(245,158,11,0.18)] hover:[box-shadow:0_0_32px_-4px_rgba(245,158,11,0.32)]',
  },
  {
    id: 4,
    tag: 'limited',
    type: 'Limited Time',
    title: 'Flash Tournament',
    desc: 'Join the weekend slot tournament. Top 100 players split a $50,000 prize pool.',
    bonus: '$50,000 Prize Pool',
    expiry: 'Ends Sunday 23:59',
    icon: Flame,
    image: '/images/promo/1778661569571%20(1).jpeg',
    accentFrom: 'from-rose-500',
    accentTo: 'to-amber-400',
    glowClass: 'glow-purple',
    variantClass: 'border-rose-500/25 hover:border-rose-500/55 [box-shadow:0_0_22px_-5px_rgba(239,68,68,0.18)] hover:[box-shadow:0_0_32px_-4px_rgba(239,68,68,0.32)]',
    hot: true,
  },
  {
    id: 5,
    tag: 'new',
    type: 'Referral',
    title: 'Refer & Earn',
    desc: 'Invite a friend and both of you receive $188 bonus when they make their first deposit.',
    bonus: '$188 Per Referral',
    expiry: 'Permanent',
    icon: Star,
    image: '/images/promo/1778661569571.jpeg',
    accentFrom: 'from-neon-purple',
    accentTo: 'to-rose-400',
    glowClass: 'glow-purple',
    variantClass: 'border-neon-purple/25 hover:border-neon-purple/55 [box-shadow:0_0_22px_-5px_oklch(0.62_0.28_305/0.22)] hover:[box-shadow:0_0_32px_-4px_oklch(0.62_0.28_305/0.38)]',
    new: true,
  },
  {
    id: 6,
    tag: 'deposit',
    type: 'VIP Exclusive',
    title: 'VIP Monthly Gift',
    desc: 'VIP members receive exclusive monthly bonuses, luxury gifts, and priority support.',
    bonus: 'Up to $3,888 / Month',
    expiry: '1st of Each Month',
    icon: Tag,
    image: '/images/promo/1778670069329.jpeg',
    accentFrom: 'from-amber-400',
    accentTo: 'to-neon-mint',
    glowClass: 'glow-mint',
    variantClass: 'border-neon-mint/25 hover:border-neon-mint/55 [box-shadow:0_0_22px_-5px_oklch(0.82_0.19_168/0.22)] hover:[box-shadow:0_0_32px_-4px_oklch(0.82_0.19_168/0.38)]',
  },
]

const filtered = computed(() =>
  activeTab.value === 'all'
    ? promotions
    : promotions.filter(p => p.tag === activeTab.value),
)

const expanded = ref<Record<number, boolean>>({})

function toggleExpand(id: number) {
  expanded.value[id] = !expanded.value[id]
}
</script>

<template>
  <div class="min-h-screen bg-background">

    <!-- Tab bar -->
    <section class="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 sm:px-6">
      <div class="max-w-7xl mx-auto">
        <ul
          role="tablist"
          aria-label="Promotion categories"
          class="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3"
        >
          <li v-for="tab in tabs" :key="tab.value" role="none">
            <button
              role="tab"
              :aria-selected="activeTab === tab.value"
              :class="cn(
                'relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300',
                activeTab === tab.value
                  ? 'text-neon-mint bg-neon-mint/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-2',
              )"
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
              <span
                :class="cn(
                  'absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full bg-neon-mint transition-all duration-300 origin-left',
                  activeTab === tab.value ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0',
                )"
                aria-hidden="true"
              />
            </button>
          </li>
        </ul>
      </div>
    </section>

    <!-- Promo grid -->
    <section
      class="max-w-7xl mx-auto px-4 sm:px-6 pt-25 pb-10"
      aria-label="Available promotions"
    >
      <Transition name="fade" mode="out-in">
        <ul
          :key="activeTab"
          role="list"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <li
            v-for="promo in filtered"
            :key="promo.id"
          >
            <article
              :class="cn(
                'glass-card rounded-2xl overflow-hidden border',
                'hover:-translate-y-1 transition-all duration-300 group',
                'flex flex-col',
                promo.variantClass,
              )"
            >
              <!-- Image banner -->
              <div class="relative h-44 overflow-hidden shrink-0">
                <img
                  :src="promo.image"
                  :alt="promo.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <!-- Gradient overlay bottom-to-top -->
                <div class="absolute inset-0 bg-linear-to-t from-background/85 via-background/25 to-transparent pointer-events-none" />
                <!-- Accent bar at bottom of image -->
                <div
                  :class="cn('absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r', promo.accentFrom, promo.accentTo)"
                  aria-hidden="true"
                />
                <!-- Badges top-right -->
                <div class="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
                  <span
                    v-if="promo.hot"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest bg-rose-500/30 text-rose-400 border border-rose-500/40 backdrop-blur-sm"
                  >
                    <Flame class="w-2.5 h-2.5" aria-hidden="true" /> HOT
                  </span>
                  <span
                    v-if="promo.new"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest bg-neon-mint/20 text-neon-mint border border-neon-mint/40 backdrop-blur-sm"
                  >
                    NEW
                  </span>
                </div>
                <!-- Icon bottom-left over image -->
                <div
                  :class="cn(
                    'absolute bottom-3 left-4 w-10 h-10 rounded-xl flex items-center justify-center',
                    'bg-background/70 backdrop-blur-md border border-border/70',
                    promo.glowClass,
                  )"
                >
                  <component :is="promo.icon" class="w-5 h-5 text-neon-purple" aria-hidden="true" />
                </div>
              </div>

              <!-- Always-visible header: type + title -->
              <div class="px-5 pt-4 pb-3">
                <p class="text-[10px] font-mono text-neon-purple tracking-widest uppercase mb-1.5">
                  {{ promo.type }}
                </p>
                <h2
                  :class="cn(
                    'font-display font-bold text-base leading-snug transition-colors duration-300',
                    expanded[promo.id] ? 'text-neon-mint' : 'text-foreground group-hover:text-neon-mint',
                  )"
                >
                  {{ promo.title }}
                </h2>
              </div>

              <!-- Toggle button -->
              <button
                type="button"
                :aria-expanded="!!expanded[promo.id]"
                :class="cn(
                  'flex items-center justify-center gap-1.5 w-full px-5 py-2.5 border-t border-border/60',
                  'text-[11px] font-mono tracking-widest uppercase transition-all duration-300 touch-press',
                  expanded[promo.id]
                    ? 'text-neon-mint bg-neon-mint/5 hover:bg-neon-mint/10'
                    : 'text-muted-foreground hover:text-neon-mint hover:bg-neon-mint/5',
                )"
                @click="toggleExpand(promo.id)"
              >
                <span>{{ expanded[promo.id] ? t('promotions.collapse') : t('promotions.expand') }}</span>
                <ChevronDown
                  :class="cn(
                    'w-3.5 h-3.5 transition-transform duration-300',
                    expanded[promo.id] && 'rotate-180',
                  )"
                  aria-hidden="true"
                />
              </button>

              <!-- Collapsible details -->
              <Transition name="detail-expand">
                <div
                  v-if="expanded[promo.id]"
                  class="px-5 pt-4 pb-5 flex flex-col gap-4 border-t border-neon-mint/15 bg-neon-mint/[0.03]"
                >
                  <!-- Description -->
                  <p class="text-sm text-muted-foreground font-body leading-relaxed">
                    {{ promo.desc }}
                  </p>

                  <!-- Bonus + Validity -->
                  <div class="flex items-center justify-between gap-4 pt-2 border-t border-border/60">
                    <div>
                      <p class="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-0.5">{{ t('promotions.bonus') }}</p>
                      <p class="font-display font-black text-neon-mint text-glow-mint text-sm">{{ promo.bonus }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-0.5 flex items-center justify-end gap-1">
                        <Clock class="w-3 h-3" aria-hidden="true" /> {{ t('promotions.validity') }}
                      </p>
                      <p class="text-xs text-muted-foreground font-body">{{ promo.expiry }}</p>
                    </div>
                  </div>

                  <!-- Claim button -->
                  <button
                    type="button"
                    :class="cn(
                      'w-full flex items-center justify-center gap-2 py-3 rounded-xl',
                      'font-display font-bold text-sm tracking-wider',
                      'bg-neon-purple/20 text-neon-mint border border-neon-purple/30',
                      'hover:bg-neon-purple hover:text-primary-foreground hover:border-neon-purple',
                      'transition-all duration-300 glow-purple active:scale-95 touch-press',
                    )"
                  >
                    {{ t('promotions.claimNow') }}
                    <ChevronRight class="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </Transition>

            </article>
          </li>
        </ul>
      </Transition>

      <div v-if="filtered.length === 0" class="py-24 text-center">
        <Gift class="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
        <p class="text-muted-foreground font-body">{{ t('promotions.noPromos') }}</p>
      </div>
    </section>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.detail-expand-enter-active {
  transition: opacity 0.25s ease, max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.detail-expand-leave-active {
  transition: opacity 0.18s ease, max-height 0.28s cubic-bezier(0.4, 0, 1, 1);
}
.detail-expand-enter-from,
.detail-expand-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}
.detail-expand-enter-to,
.detail-expand-leave-from {
  opacity: 1;
  max-height: 24rem;
  overflow: hidden;
}
</style>
