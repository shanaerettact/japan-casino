<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Zap, Play, Star, Users, Shield } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Stat {
  label: string
  sublabel: string
  value: string
  icon: unknown
}

const stats: Stat[] = [
  { label: 'アクティブ', sublabel: 'Active Users',  value: '2.4M+',  icon: Users },
  { label: 'タイトル数', sublabel: 'Games',          value: '1,800+', icon: Star },
  { label: '実績',       sublabel: 'Achievements',  value: '50K+',   icon: Shield },
]

const tags: string[] = ['#CyberRPG', '#MechaBattle', '#NeonQuest', '#AnimeAction', '#GhostProtocol']

const mounted   = ref(false)
const glitching = ref(false)

let glitchInterval: ReturnType<typeof setInterval>

onMounted(() => {
  mounted.value = true
  glitchInterval = setInterval(() => {
    glitching.value = true
    setTimeout(() => { glitching.value = false }, 600)
  }, 7000)
})

onUnmounted(() => {
  clearInterval(glitchInterval)
})
</script>

<template>
  <section
    id="hero"
    class="relative min-h-screen flex flex-col overflow-hidden scroll-mt-16"
    aria-label="Hero section"
  >
    
    <div class="absolute inset-0 z-0" aria-hidden="true">
      <img
        src="/images/hero-bg.jpg"
        alt=""
        class="w-full h-full object-cover object-center opacity-20"
      />
      <div class="absolute inset-0 bg-linear-to-b from-background/80 via-background/40 to-background" />
      <div class="absolute inset-0 bg-linear-to-r from-background via-transparent to-background/80" />
      
      <div
        class="absolute inset-0 opacity-5"
        style="
          background-image:
            linear-gradient(oklch(0.82 0.19 168) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.82 0.19 168) 1px, transparent 1px);
          background-size: 60px 60px;
        "
      />
    </div>

    
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-neon-purple/10 blur-3xl animate-neon-pulse" />
      <div class="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-neon-mint/8 blur-3xl animate-neon-pulse delay-300" />
      <div class="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-purple/5 blur-[100px]" />
    </div>

    
    <div class="absolute inset-0 z-0 scanline pointer-events-none" aria-hidden="true" />

    
    <div class="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-28 pb-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-0">

      
      <div class="flex-1 flex flex-col justify-center lg:pr-8 text-center lg:text-left">

        
        <div
          :class="cn(
            'inline-flex items-center gap-2 self-center lg:self-start mb-6 px-4 py-1.5 rounded-full',
            'bg-neon-purple/15 border border-neon-purple/30 text-neon-mint text-xs font-body font-semibold tracking-widest',
            mounted ? 'animate-fade-up' : 'opacity-0',
          )"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-neon-mint animate-neon-pulse" aria-hidden="true" />
          NEW SEASON 12 — シーズン12 開幕
        </div>

        
        <h1
          :class="cn(
            'font-display font-black leading-tight text-balance',
            'text-4xl sm:text-5xl md:text-6xl xl:text-7xl',
            mounted ? 'animate-slide-left delay-100' : 'opacity-0',
          )"
        >
          <span :class="cn('block text-foreground', glitching ? 'animate-glitch' : '')">CYBER</span>
          <span class="block text-neon-purple text-glow-purple">パンク</span>
          <span class="block text-neon-mint text-glow-mint">ARENA</span>
        </h1>

        
        <p
          :class="cn(
            'mt-4 max-w-md mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed font-body text-muted-foreground',
            mounted ? 'animate-fade-up delay-200' : 'opacity-0',
          )"
        >
          電脳都市へようこそ。最高峰のアニメゲームが集結した
          <span class="text-foreground font-semibold">ネコバース</span>で、
          究極のゲーム体験を解放せよ。
        </p>

        
        <div
          :class="cn(
            'flex flex-wrap gap-2 mt-5 justify-center lg:justify-start',
            mounted ? 'animate-fade-up delay-300' : 'opacity-0',
          )"
        >
          <span
            v-for="tag in tags"
            :key="tag"
            class="px-3 py-1 rounded-full text-xs font-body text-neon-purple border border-neon-purple/30 bg-neon-purple/10 hover:bg-neon-purple/20 cursor-pointer transition-colors duration-200"
          >
            {{ tag }}
          </span>
        </div>

        
        <div
          :class="cn(
            'flex flex-col sm:flex-row gap-3 mt-8 justify-center lg:justify-start',
            mounted ? 'animate-fade-up delay-400' : 'opacity-0',
          )"
        >
          <a
            href="#games"
            :class="cn(
              'flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl',
              'font-display font-bold text-base tracking-wider',
              'bg-neon-purple text-primary-foreground',
              'hover:bg-neon-purple/85 transition-all duration-300',
              'glow-purple hover:scale-105 active:scale-95',
              'clip-corner',
            )"
          >
            <Zap class="w-5 h-5" aria-hidden="true" />
            今すぐプレイ
          </a>
          <a
            href="#featured"
            :class="cn(
              'flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl',
              'font-display font-bold text-base tracking-wider',
              'bg-transparent text-neon-mint border-2 border-neon-mint/50',
              'hover:bg-neon-mint/10 hover:border-neon-mint transition-all duration-300',
              'hover:scale-105 active:scale-95',
            )"
          >
            <Play class="w-4 h-4 fill-neon-mint" aria-hidden="true" />
            注目作を見る
          </a>
        </div>

        
        <div
          :class="cn(
            'flex flex-wrap gap-6 mt-10 justify-center lg:justify-start',
            mounted ? 'animate-fade-up delay-500' : 'opacity-0',
          )"
        >
          <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-surface-2 border border-border">
              <component :is="stat.icon" class="w-4 h-4 text-neon-mint" aria-hidden="true" />
            </div>
            <div>
              <div class="font-display font-black text-lg text-foreground leading-none">{{ stat.value }}</div>
              <div class="text-xs font-body text-muted-foreground leading-tight mt-0.5">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      
      <div
        :class="cn(
          'relative flex-shrink-0 flex justify-center items-end',
          'w-full lg:w-auto lg:flex-1 max-w-sm lg:max-w-lg xl:max-w-xl',
          mounted ? 'animate-slide-right delay-200' : 'opacity-0',
        )"
        aria-hidden="true"
      >
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-20 rounded-full bg-neon-purple/30 blur-2xl" />
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 rounded-full bg-neon-mint/20 blur-xl" />

        
        <div class="absolute top-0 left-4 w-8 h-8 border-t-2 border-l-2 border-neon-mint/60 rounded-tl-lg" />
        <div class="absolute top-0 right-4 w-8 h-8 border-t-2 border-r-2 border-neon-purple/60 rounded-tr-lg" />
        <div class="absolute bottom-0 left-4 w-8 h-8 border-b-2 border-l-2 border-neon-purple/60 rounded-bl-lg" />
        <div class="absolute bottom-0 right-4 w-8 h-8 border-b-2 border-r-2 border-neon-mint/60 rounded-br-lg" />

        
        <img
          src="/images/mascot.jpg"
          alt="NekoVerse cyberpunk anime mascot character"
          class="relative z-10 w-full h-auto max-h-[540px] object-contain object-bottom animate-float drop-shadow-[0_0_40px_oklch(0.62_0.28_305_/_0.5)]"
        />

        
        <div class="absolute top-8 right-0 bg-surface-1 border border-neon-mint/30 rounded-2xl px-3 py-2 flex flex-col items-center glow-mint">
          <Star class="w-4 h-4 text-neon-mint mb-0.5" aria-hidden="true" />
          <span class="text-[10px] font-display font-black text-neon-mint">S-RANK</span>
        </div>

        
        <div class="absolute top-24 left-0 bg-surface-1 border border-neon-purple/30 rounded-2xl px-3 py-2 glow-purple">
          <div class="text-[10px] font-body text-muted-foreground">Level</div>
          <div class="text-sm font-display font-black text-neon-purple">MAX</div>
        </div>
      </div>
    </div>

    
    <div class="relative z-10 flex justify-center pb-8" aria-hidden="true">
      <div class="flex flex-col items-center gap-2 animate-bounce">
        <span class="text-xs font-body text-muted-foreground tracking-widest">SCROLL</span>
        <div class="w-[1px] h-8 bg-linear-to-b from-neon-purple/70 to-transparent" />
      </div>
    </div>
  </section>
</template>
