<script setup lang="ts">
import { Zap, Twitter, Youtube, Github, MessageCircle } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface FooterSection {
  heading: string
  headingEn: string
  links: string[]
}

interface Social {
  label: string
  icon: unknown
  href: string
}

const footerLinks: FooterSection[] = [
  {
    heading: 'ゲーム', headingEn: 'Games',
    links: ['新着ゲーム / New', '人気ゲーム / Popular', '無料ゲーム / Free', 'ジャンル / Genres'],
  },
  {
    heading: 'コミュニティ', headingEn: 'Community',
    links: ['フォーラム / Forums', 'ランキング / Rankings', 'イベント / Events', 'ブログ / Blog'],
  },
  {
    heading: 'サポート', headingEn: 'Support',
    links: ['ヘルプ / Help', 'お問い合わせ / Contact', 'プライバシー / Privacy', '利用規約 / Terms'],
  },
]

const socials: Social[] = [
  { label: 'Twitter / X', icon: Twitter,       href: '#' },
  { label: 'YouTube',     icon: Youtube,        href: '#' },
  { label: 'Discord',     icon: MessageCircle,  href: '#' },
  { label: 'GitHub',      icon: Github,         href: '#' },
]
</script>

<template>
  <footer class="relative mt-8 border-t border-border" role="contentinfo">
    <!-- Top neon line -->
    <div class="h-[2px] w-full bg-linear-to-r from-neon-purple via-neon-mint to-neon-purple animate-neon-pulse" aria-hidden="true" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        <!-- Brand column -->
        <div class="lg:col-span-2">
          <a href="#" class="flex items-center gap-2.5 mb-4" aria-label="NekoVerse home">
            <div class="relative w-9 h-9">
              <div class="absolute inset-0 rounded-xl bg-neon-purple/30 glow-purple" aria-hidden="true" />
              <Zap class="absolute inset-0 m-auto w-5 h-5 text-neon-mint" aria-hidden="true" />
            </div>
            <span class="font-display text-xl font-black tracking-widest text-foreground">
              NEKO<span class="text-neon-purple">VERSE</span>
            </span>
          </a>
          <p class="text-sm font-body text-muted-foreground leading-relaxed max-w-xs">
            日本最大のサイバーパンクアニメゲームポータル。究極のゲーム体験を、あなたの手に。
            <br />
            <span class="text-muted-foreground/60 text-xs">Japan's premier cyberpunk anime gaming destination.</span>
          </p>

          <!-- Social links -->
          <div class="flex items-center gap-3 mt-6" role="list" aria-label="Social media links">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              :aria-label="social.label"
              role="listitem"
              :class="cn(
                'w-9 h-9 rounded-xl flex items-center justify-center',
                'border border-border text-muted-foreground',
                'hover:border-neon-purple/50 hover:text-neon-purple hover:bg-neon-purple/10',
                'transition-all duration-200',
              )"
            >
              <component :is="social.icon" class="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <!-- Footer link columns -->
        <div v-for="section in footerLinks" :key="section.heading">
          <h3 class="font-display font-bold text-sm text-foreground tracking-wider mb-4">
            {{ section.heading }}
            <span class="block text-xs font-body text-muted-foreground font-normal">{{ section.headingEn }}</span>
          </h3>
          <ul class="space-y-2.5" role="list">
            <li v-for="link in section.links" :key="link">
              <a
                href="#"
                class="text-sm font-body text-muted-foreground hover:text-neon-mint transition-colors duration-200 leading-relaxed"
              >
                {{ link }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs font-body text-muted-foreground">
          © 2026 NekoVerse Inc. All rights reserved. — 全著作権所有
        </p>
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-neon-mint animate-neon-pulse" aria-hidden="true" />
          <span class="text-xs font-body text-muted-foreground">All systems operational — システム正常稼働中</span>
        </div>
      </div>
    </div>
  </footer>
</template>
