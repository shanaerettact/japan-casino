<script setup lang="ts">
import { ref, computed } from 'vue'
import { Gift, Zap, Star, Clock, Trophy, Flame, Tag, ChevronRight, Sparkle } from 'lucide-vue-next'
import { cn } from '@/lib/utils'


const tabs = [
  { label: 'All', value: 'all' },
  { label: 'New Member', value: 'new' },
  { label: 'Deposit', value: 'deposit' },
  { label: 'Cashback', value: 'cashback' },
  { label: 'Limited', value: 'limited' },
]
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
  accentFrom: string
  accentTo: string
  glowClass: string
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
    accentFrom: 'from-neon-purple',
    accentTo: 'to-neon-mint',
    glowClass: 'glow-purple',
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
    accentFrom: 'from-neon-mint',
    accentTo: 'to-neon-purple',
    glowClass: 'glow-mint',
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
    accentFrom: 'from-amber-500',
    accentTo: 'to-neon-purple',
    glowClass: 'glow-purple',
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
    accentFrom: 'from-rose-500',
    accentTo: 'to-amber-400',
    glowClass: 'glow-purple',
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
    accentFrom: 'from-neon-purple',
    accentTo: 'to-rose-400',
    glowClass: 'glow-purple',
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
    accentFrom: 'from-amber-400',
    accentTo: 'to-neon-mint',
    glowClass: 'glow-mint',
  },
]

const filtered = computed(() =>
  activeTab.value === 'all'
    ? promotions
    : promotions.filter(p => p.tag === activeTab.value),
)


const stats = [
  { label: 'Active Promotions', value: '12+' },
  { label: 'Total Bonus Pool', value: '$500K' },
  { label: 'VIP Members', value: '8,800+' },
  { label: 'Max Cashback', value: '30%' },
]
</script>

<template>
  <div class="min-h-screen bg-background">

    
    <section class="relative overflow-hidden pt-24 pb-16 px-4 sm:px-6">
      
      <div class="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-neon-purple/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div class="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-neon-mint/8 blur-3xl pointer-events-none" aria-hidden="true" />

      <div class="relative max-w-7xl mx-auto text-center">
        
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-purple/40 bg-neon-purple/10 mb-6">
          <Sparkle class="w-3.5 h-3.5 text-neon-mint animate-neon-pulse" aria-hidden="true" />
          <span class="text-xs font-mono text-neon-mint tracking-widest uppercase">Exclusive Offers</span>
        </div>

        <h1 class="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground text-balance mb-4">
          キャンペーン<span class="text-neon-purple text-glow-purple">特典</span>
        </h1>
        <p class="text-muted-foreground font-body text-lg max-w-xl mx-auto text-balance leading-relaxed">
          Discover our latest promotions, reload bonuses, cashback rewards, and exclusive VIP deals — updated daily.
        </p>
      </div>

      
      <div class="relative max-w-4xl mx-auto mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="glass-card rounded-2xl p-4 text-center border border-border hover:border-neon-purple/40 transition-colors duration-300"
        >
          <p class="font-display text-2xl font-black text-neon-mint text-glow-mint">{{ stat.value }}</p>
          <p class="text-xs text-muted-foreground font-body mt-0.5 leading-relaxed">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    
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

    
    <section
      class="max-w-7xl mx-auto px-4 sm:px-6 py-10"
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
                'glass-card rounded-2xl overflow-hidden border border-border',
                'hover:border-neon-purple/50 hover:-translate-y-1 transition-all duration-300 group',
                'flex flex-col h-full',
              )"
            >
              
              <div :class="cn('h-1 w-full bg-linear-to-r', promo.accentFrom, promo.accentTo)" aria-hidden="true" />

              <div class="p-6 flex flex-col flex-1 gap-4">
                
                <div class="flex items-start justify-between gap-3">
                  
                  <div :class="cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-neon-purple/15 border border-neon-purple/30', promo.glowClass)">
                    <component :is="promo.icon" class="w-6 h-6 text-neon-purple" aria-hidden="true" />
                  </div>

                  
                  <div class="flex flex-wrap gap-1.5 justify-end">
                    <span
                      v-if="promo.hot"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    >
                      <Flame class="w-2.5 h-2.5" aria-hidden="true" /> HOT
                    </span>
                    <span
                      v-if="promo.new"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest bg-neon-mint/15 text-neon-mint border border-neon-mint/30"
                    >
                      NEW
                    </span>
                  </div>
                </div>

                
                <p class="text-[10px] font-mono text-neon-purple tracking-widest uppercase">{{ promo.type }}</p>

                
                <div class="flex flex-col gap-1.5">
                  <h2 class="font-display font-bold text-lg text-foreground leading-snug group-hover:text-neon-mint transition-colors duration-300">
                    {{ promo.title }}
                  </h2>
                  <p class="text-sm text-muted-foreground font-body leading-relaxed">{{ promo.desc }}</p>
                </div>

                
                <div class="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
                  <div>
                    <p class="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-0.5">Bonus</p>
                    <p class="font-display font-black text-neon-mint text-glow-mint text-base">{{ promo.bonus }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-0.5 flex items-center justify-end gap-1">
                      <Clock class="w-3 h-3" aria-hidden="true" /> Validity
                    </p>
                    <p class="text-xs text-muted-foreground font-body">{{ promo.expiry }}</p>
                  </div>
                </div>

                
                <button
                  type="button"
                  :class="cn(
                    'mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl',
                    'font-display font-bold text-sm tracking-wider',
                    'bg-neon-purple/20 text-neon-mint border border-neon-purple/30',
                    'hover:bg-neon-purple hover:text-primary-foreground hover:border-neon-purple',
                    'transition-all duration-300 glow-purple group-hover:scale-[1.02] active:scale-95',
                  )"
                >
                  Claim Now
                  <ChevronRight class="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          </li>
        </ul>
      </Transition>

      
      <div v-if="filtered.length === 0" class="py-24 text-center">
        <Gift class="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
        <p class="text-muted-foreground font-body">No promotions in this category right now. Check back soon.</p>
      </div>
    </section>

    
    <section class="px-4 sm:px-6 pb-24 md:pb-12">
      <div class="max-w-7xl mx-auto">
        <div class="relative overflow-hidden glass-card rounded-2xl border border-neon-purple/30 p-8 md:p-12 text-center glow-purple">
          <div class="absolute inset-0 bg-linear-to-br from-neon-purple/10 via-transparent to-neon-mint/5 pointer-events-none" aria-hidden="true" />
          <h2 class="relative font-display text-2xl md:text-3xl font-black text-foreground mb-3 text-balance">
            Become a <span class="text-neon-purple text-glow-purple">VIP Member</span>
          </h2>
          <p class="relative text-muted-foreground font-body max-w-md mx-auto mb-6 leading-relaxed">
            Unlock exclusive promotions, higher cashback rates, personal account managers, and luxury gifts.
          </p>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-display font-bold text-sm tracking-wider bg-neon-purple text-primary-foreground glow-purple hover:bg-neon-purple/80 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Star class="w-4 h-4" aria-hidden="true" />
            Apply for VIP
          </button>
        </div>
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
</style>
