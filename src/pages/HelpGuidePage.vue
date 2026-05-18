<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import {
  ArrowLeft,
  BookOpen,
  Gamepad2,
  Wallet,
  History,
  Sparkles,
  MessageCircle,
  ChevronRight,
  Headphones,
  CircleHelp,
  ChevronDown,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useI18n } from '@/composables/useI18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const helpPane = computed(() => {
  if (route.name === 'help-chat') return 'chat' as const
  if (route.name === 'help-faq') return 'faq' as const
  return 'guide' as const
})

const headerIcon = computed(() => {
  if (helpPane.value === 'chat') return Headphones
  if (helpPane.value === 'faq') return CircleHelp
  return BookOpen
})

const pageTitle = computed(() => {
  if (helpPane.value === 'chat') return t('help.chatTitle')
  if (helpPane.value === 'faq') return t('help.faqTitle')
  return t('help.guideTitle')
})

const pageSubtitle = computed(() => {
  if (helpPane.value === 'chat') return t('help.chatSubtitle')
  if (helpPane.value === 'faq') return t('help.faqSubtitle')
  return t('help.guideSubtitle')
})

const blocks = computed(() => [
  { title: t('help.block1Title'), desc: t('help.block1Desc'), icon: BookOpen, hint: t('help.block1Hint') },
  { title: t('help.block2Title'), desc: t('help.block2Desc'), icon: Gamepad2, to: '/category/all' },
  { title: t('help.block3Title'), desc: t('help.block3Desc'), icon: Wallet,   to: '/account/withdraw' },
  { title: t('help.block4Title'), desc: t('help.block4Desc'), icon: History,  to: '/account/game-history' },
  { title: t('help.block5Title'), desc: t('help.block5Desc'), icon: Sparkles, to: '/about/cyber-neo' },
])

const faqItems = computed(() => [
  { q: t('help.faqQ1'), a: t('help.faqA1') },
  { q: t('help.faqQ2'), a: t('help.faqA2') },
  { q: t('help.faqQ3'), a: t('help.faqA3') },
])

const openFaqIndex = ref<number | null>(0)

function toggleFaq(i: number) {
  openFaqIndex.value = openFaqIndex.value === i ? null : i
}
</script>

<template>
  <main
    class="relative min-h-screen bg-background pt-20 pb-28 md:pb-16 overflow-x-hidden"
    :aria-label="pageTitle"
  >
    <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-28 right-0 w-[420px] h-[420px] rounded-full bg-neon-mint/[0.06] blur-[110px]" />
      <div class="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-neon-purple/[0.07] blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-5">
      <div class="flex items-center gap-3 sm:gap-4 animate-slide-left">
        <button
          type="button"
          aria-label="前のページに戻る"
          class="group flex items-center justify-center size-10 sm:size-11 rounded-xl border border-border/70 bg-surface-2/60 backdrop-blur-md hover:border-neon-mint/50 hover:bg-neon-mint/10 transition-all duration-300 touch-press shrink-0"
          @click="router.back()"
        >
          <ArrowLeft class="w-4 h-4 text-muted-foreground group-hover:text-neon-mint transition-colors duration-300" aria-hidden="true" />
        </button>
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-neon-purple/12 ring-1 ring-neon-purple/30 shrink-0"
            aria-hidden="true"
          >
            <component :is="headerIcon" class="w-5 h-5 text-neon-purple" />
          </div>
          <div class="min-w-0">
            <h1 class="font-display text-xl sm:text-2xl font-black tracking-[0.1em] text-foreground text-glow-mint leading-none">
              {{ pageTitle }}
            </h1>
            <p class="font-body text-[11px] sm:text-xs text-muted-foreground mt-1 tracking-wide">
              {{ pageSubtitle }}
            </p>
          </div>
        </div>
      </div>

      <template v-if="helpPane === 'guide'">
        <p class="font-body text-sm text-muted-foreground leading-relaxed animate-fade-up delay-100">
          {{ t('help.guideDesc') }}
        </p>

        <ul class="space-y-2.5 list-none p-0 m-0" role="list">
          <li
            v-for="(b, i) in blocks"
            :key="b.title"
            class="animate-fade-up"
            :style="{ animationDelay: `${80 + i * 60}ms` }"
          >
            <component
              :is="b.to ? 'RouterLink' : 'div'"
              v-bind="b.to ? { to: b.to } : {}"
              :class="cn(
                'flex w-full items-stretch gap-3 rounded-2xl border p-3.5 sm:p-4 transition-all duration-200',
                b.to
                  ? 'border-border/55 bg-surface-1/70 backdrop-blur-md hover:border-neon-mint/35 hover:bg-neon-mint/[0.06] hover:ring-1 hover:ring-neon-mint/15 touch-press'
                  : 'border-border/40 bg-surface-2/40 border-dashed',
              )"
            >
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neon-purple/10 ring-1 ring-neon-purple/20"
                aria-hidden="true"
              >
                <component :is="b.icon" class="w-4 h-4 text-neon-mint" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-display text-xs font-black tracking-wide text-foreground">{{ b.title }}</p>
                <p class="font-body text-[13px] text-muted-foreground mt-1 leading-snug">{{ b.desc }}</p>
                <p v-if="b.hint" class="font-body text-[11px] text-neon-mint/85 mt-1.5">{{ b.hint }}</p>
              </div>
              <ChevronRight
                v-if="b.to"
                class="w-4 h-4 shrink-0 text-muted-foreground self-center"
                aria-hidden="true"
              />
            </component>
          </li>
        </ul>

        <div
          class="rounded-2xl border border-neon-mint/25 bg-surface-2/45 backdrop-blur-sm p-4 flex items-start gap-3 ring-1 ring-neon-mint/10"
        >
          <MessageCircle class="w-5 h-5 text-neon-mint shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p class="font-body text-sm font-semibold text-foreground">{{ t('help.otherSupportTitle') }}</p>
            <p class="font-body text-xs text-muted-foreground mt-1 leading-relaxed">
              {{ t('help.otherSupportDesc') }}
            </p>
            <div class="flex flex-wrap gap-2 mt-3">
              <RouterLink
                to="/help/chat"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-neon-mint hover:text-neon-purple transition-colors"
              >
                <Headphones class="w-3.5 h-3.5" aria-hidden="true" />
                {{ t('help.toChat') }}
              </RouterLink>
              <RouterLink
                to="/help/faq"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-neon-mint hover:text-neon-purple transition-colors"
              >
                <CircleHelp class="w-3.5 h-3.5" aria-hidden="true" />
                {{ t('help.toFaq') }}
              </RouterLink>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="helpPane === 'chat'">
        <p class="font-body text-sm text-muted-foreground leading-relaxed">
          {{ t('help.chatDesc') }}
        </p>
        <div class="rounded-2xl border border-neon-mint/30 bg-surface-1/70 backdrop-blur-md p-4 sm:p-5 space-y-4 ring-1 ring-neon-mint/10">
          <div class="flex items-center gap-3">
            <div class="flex size-12 rounded-xl bg-neon-mint/15 ring-1 ring-neon-mint/30 items-center justify-center shrink-0">
              <Headphones class="w-6 h-6 text-neon-mint" aria-hidden="true" />
            </div>
            <div>
              <p class="font-display text-sm font-black text-foreground tracking-wide">{{ t('help.chatReception') }}</p>
              <p class="font-body text-xs text-muted-foreground mt-0.5">{{ t('help.chatHours') }}</p>
            </div>
          </div>
          <p class="font-body text-[13px] text-muted-foreground leading-relaxed">
            {{ t('help.chatDesc') }}
          </p>
          <button
            type="button"
            class="w-full h-11 rounded-xl font-display text-xs font-black tracking-widest bg-neon-mint/20 text-neon-mint border border-neon-mint/40 hover:bg-neon-mint/30 transition-all touch-press opacity-60 cursor-not-allowed"
            disabled
          >
            {{ t('help.chatStartBtn') }}
          </button>
          <RouterLink
            to="/help/faq"
            class="block text-center font-body text-xs text-neon-purple hover:text-neon-mint transition-colors"
          >
            {{ t('help.chatSeeFaq') }}
          </RouterLink>
        </div>
      </template>

      <template v-else>
        <p class="font-body text-sm text-muted-foreground leading-relaxed">
          {{ t('help.faqDesc') }}
        </p>
        <ul class="space-y-2 list-none p-0 m-0" role="list">
          <li
            v-for="(item, i) in faqItems"
            :key="i"
            class="rounded-2xl border border-border/55 bg-surface-1/70 backdrop-blur-md overflow-hidden ring-1 ring-neon-purple/5"
          >
            <button
              type="button"
              class="flex w-full items-center justify-between gap-2 px-3.5 py-3.5 text-left touch-press hover:bg-surface-2/50 transition-colors"
              :aria-expanded="openFaqIndex === i"
              @click="toggleFaq(i)"
            >
              <span class="font-body text-sm font-semibold text-foreground leading-snug">{{ item.q }}</span>
              <ChevronDown
                :class="cn(
                  'w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200',
                  openFaqIndex === i && 'rotate-180 text-neon-mint',
                )"
                aria-hidden="true"
              />
            </button>
            <div
              v-show="openFaqIndex === i"
              class="px-3.5 pb-3.5 pt-0 border-t border-border/30 bg-surface-2/20"
            >
              <p class="font-body text-[13px] text-muted-foreground leading-relaxed pt-3">
                {{ item.a }}
              </p>
            </div>
          </li>
        </ul>
        <RouterLink
          to="/help/chat"
          class="flex items-center justify-center gap-2 rounded-2xl border border-neon-purple/35 bg-neon-purple/8 py-3 font-body text-sm font-semibold text-neon-purple hover:bg-neon-purple/12 transition-colors touch-press"
        >
          <Headphones class="w-4 h-4" aria-hidden="true" />
          {{ t('help.faqSeeChat') }}
        </RouterLink>
      </template>
    </div>
  </main>
</template>
