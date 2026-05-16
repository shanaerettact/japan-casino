<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Sparkles, Shield, FileText, HeartHandshake } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

type NeoSection = 'about' | 'privacy' | 'terms' | 'responsible'

const section = computed((): NeoSection => {
  const p = route.path
  if (p === '/about/cyber-neo') return 'about'
  if (p === '/about/privacy') return 'privacy'
  if (p === '/about/terms') return 'terms'
  if (p === '/about/responsible-gambling') return 'responsible'
  return 'about'
})

const pageTitle = computed(() => {
  switch (section.value) {
    case 'privacy':
      return '隱私權'
    case 'terms':
      return '服務條款'
    case 'responsible':
      return '負責任博彩'
    default:
      return 'Cyber Neo'
  }
})

const pageSubtitle = computed(() => {
  switch (section.value) {
    case 'about':
      return '關於 Cyber Neo 設計系統'
    case 'privacy':
      return 'PRIVACY POLICY'
    case 'terms':
      return 'TERMS OF SERVICE'
    case 'responsible':
      return 'RESPONSIBLE GAMBLING'
    default:
      return ''
  }
})

const headerIcon = computed(() => {
  switch (section.value) {
    case 'privacy':
      return Shield
    case 'terms':
      return FileText
    case 'responsible':
      return HeartHandshake
    default:
      return Sparkles
  }
})
</script>

<template>
  <main
    class="relative min-h-screen bg-background pt-20 pb-28 md:pb-16 overflow-x-hidden"
    :aria-label="pageTitle"
  >
    <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-neon-purple/[0.07] blur-[120px]" />
      <div class="absolute bottom-1/4 -right-40 w-[400px] h-[400px] rounded-full bg-neon-mint/[0.06] blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6">
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
            <h1 class="font-display text-xl sm:text-2xl font-black tracking-[0.12em] text-foreground text-glow-purple leading-none">
              {{ pageTitle }}
            </h1>
            <p class="font-body text-[11px] sm:text-xs text-muted-foreground mt-1 tracking-wide">
              {{ pageSubtitle }}
            </p>
          </div>
        </div>
      </div>

      <section
        v-show="section === 'about'"
        aria-labelledby="cyberneo-about-heading"
        class="rounded-2xl border border-neon-purple/30 bg-surface-1/70 backdrop-blur-md p-4 sm:p-5 ring-1 ring-neon-purple/10 animate-fade-up"
      >
        <h2 id="cyberneo-about-heading" class="font-display text-[10px] font-black tracking-[0.2em] text-neon-purple uppercase mb-3 flex items-center gap-2">
          <Sparkles class="w-3.5 h-3.5" aria-hidden="true" />
          Cyber Neo
        </h2>
        <div class="font-body text-sm text-foreground/95 space-y-3 leading-relaxed">
          <p>
            <span class="font-semibold text-neon-mint">Cyber Neo</span>
            は、NekoVerse が採用する次世代ネオン UI トーンの総称です。パープル × ミントのコントラストと、深いダークベースで「賽博龐克 × アニメ」世界観を統一しています。
          </p>
          <p class="text-muted-foreground text-[13px]">
            本サイトのレイアウト・アニメーション・グローエフェクトは Cyber Neo デザインシステムに準拠し、同じトークン（色・余白・タイポ）で再現可能です。
          </p>
          <p class="font-mono text-[11px] text-muted-foreground/80 border-t border-border/40 pt-3 mt-4">
            nekoverse.app · Cyber Neo UI · 2026
          </p>
        </div>
      </section>

      <section
        v-show="section === 'privacy'"
        aria-labelledby="cyberneo-privacy-heading"
        class="rounded-2xl border border-neon-mint/25 bg-surface-1/70 backdrop-blur-md p-4 sm:p-5 ring-1 ring-neon-mint/10 animate-fade-up"
      >
        <h2 id="cyberneo-privacy-heading" class="font-display text-[10px] font-black tracking-[0.2em] text-neon-mint uppercase mb-3 flex items-center gap-2">
          <Shield class="w-3.5 h-3.5" aria-hidden="true" />
          隱私權政策（示意）
        </h2>
        <div class="font-body text-sm text-foreground/95 space-y-3 leading-relaxed">
          <p class="text-muted-foreground text-[13px]">
            本頁為演示用占位內容。正式上線時請替換為貴司實際之個人資料蒐集目的、法依據、保存期間、當事人權利與聯絡方式等完整條款。
          </p>
          <p>
            我們重視您的隱私，僅在提供服務所需範圍內處理資料，並依適用法令採取適當安全措施。
          </p>
        </div>
      </section>

      <section
        v-show="section === 'terms'"
        aria-labelledby="cyberneo-terms-heading"
        class="rounded-2xl border border-neon-purple/30 bg-surface-1/70 backdrop-blur-md p-4 sm:p-5 ring-1 ring-neon-purple/10 animate-fade-up"
      >
        <h2 id="cyberneo-terms-heading" class="font-display text-[10px] font-black tracking-[0.2em] text-neon-purple uppercase mb-3 flex items-center gap-2">
          <FileText class="w-3.5 h-3.5" aria-hidden="true" />
          服務條款（示意）
        </h2>
        <div class="font-body text-sm text-foreground/95 space-y-3 leading-relaxed">
          <p class="text-muted-foreground text-[13px]">
            本頁為演示用占位內容。請於正式環境載入完整適用條款，包括服務描述、帳戶規範、免責事由、準據法與管轄等。
          </p>
          <p>
            使用本網站與相關服務即表示您同意遵守本平台公告之使用規範。
          </p>
        </div>
      </section>

      <section
        v-show="section === 'responsible'"
        aria-labelledby="cyberneo-responsible-heading"
        class="rounded-2xl border border-neon-mint/25 bg-surface-1/70 backdrop-blur-md p-4 sm:p-5 ring-1 ring-neon-mint/10 animate-fade-up"
      >
        <h2 id="cyberneo-responsible-heading" class="font-display text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase mb-3 flex items-center gap-2">
          <HeartHandshake class="w-3.5 h-3.5 text-neon-mint" aria-hidden="true" />
          負責任博彩（示意）
        </h2>
        <div class="font-body text-sm text-foreground/95 space-y-3 leading-relaxed">
          <p class="text-muted-foreground text-[13px]">
            博彩應以娛樂為目的。若您或身邊的人需要協助，請尋求專業支持並考慮自我排除等工具。
          </p>
          <p>
            本平台演示環境不提供真實博彩；正式產品請依主管機關要求披露警語、限制與協助資源連結。
          </p>
        </div>
      </section>
    </div>
  </main>
</template>
