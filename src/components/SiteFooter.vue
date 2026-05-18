<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Twitter, Youtube, Github, MessageCircle } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

interface FooterLink {
  label: string
  to: string
}

interface FooterSection {
  heading: string
  links: FooterLink[]
}

interface Social {
  label: string
  icon: unknown
  href: string
}

const footerLinks = computed<FooterSection[]>(() => [
  {
    heading: t('nav.help'),
    links: [
      { label: t('nav.helpChat'), to: '/help/chat' },
      { label: t('nav.helpFaq'), to: '/help/faq' },
    ],
  },
  {
    heading: t('nav.aboutCyberNeo'),
    links: [
      { label: t('nav.aboutCyberNeoLink'), to: '/about/cyber-neo' },
      { label: t('nav.privacy'), to: '/about/privacy' },
      { label: t('nav.terms'), to: '/about/terms' },
      { label: t('nav.responsibleGambling'), to: '/about/responsible-gambling' },
    ],
  },
])

const socials: Social[] = [
  { label: 'Twitter / X', icon: Twitter,       href: '#' },
  { label: 'YouTube',     icon: Youtube,        href: '#' },
  { label: 'Discord',     icon: MessageCircle,  href: '#' },
  { label: 'GitHub',      icon: Github,         href: '#' },
]
</script>

<template>
  <footer class="relative border-t border-border" role="contentinfo">

    <div class="h-[2px] w-full bg-linear-to-r from-neon-purple via-neon-mint to-neon-purple animate-neon-pulse" aria-hidden="true" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        <!-- Brand -->
        <div class="lg:col-span-2">
          <RouterLink to="/" class="flex items-center gap-2.5 mb-4" aria-label="Neo Cyber home">
            <img src="/logo.png" alt="Neo Cyber" class="h-10 w-auto object-contain" />
          </RouterLink>
          <p class="text-sm font-body text-muted-foreground leading-relaxed max-w-xs">
            日本最大のサイバーパンクアニメゲームポータル。究極のゲーム体験を、あなたの手に。
            <br />
            <span class="text-muted-foreground/60 text-xs">Japan's premier cyberpunk anime gaming destination.</span>
          </p>

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

        <!-- Link sections -->
        <div v-for="section in footerLinks" :key="section.heading">
          <h3 class="font-display font-bold text-sm text-foreground tracking-wider mb-4">
            {{ section.heading }}
          </h3>
          <ul class="space-y-2.5" role="list">
            <li v-for="link in section.links" :key="link.to">
              <RouterLink
                :to="link.to"
                class="text-sm font-body text-muted-foreground hover:text-neon-mint transition-colors duration-200 leading-relaxed"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

      </div>

      <div class="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs font-body text-muted-foreground">
          © 2026 Neo Cyber Inc. All rights reserved. — 全著作権所有
        </p>
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-neon-mint animate-neon-pulse" aria-hidden="true" />
          <span class="text-xs font-body text-muted-foreground">All systems operational — システム正常稼働中</span>
        </div>
      </div>
    </div>
  </footer>
</template>
