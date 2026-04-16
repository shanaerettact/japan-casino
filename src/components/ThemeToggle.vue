<script setup lang="ts">
import { computed } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'
import { cn } from '@/lib/utils'

const { theme, toggle } = useTheme()
const isLight = computed(() => theme.value === 'light')
</script>

<template>
  <button
    type="button"
    :aria-label="isLight ? 'Switch to dark mode' : 'Switch to light mode'"
    :title="isLight ? 'ダークモードへ' : 'ライトモードへ'"
    :class="cn(
      'relative flex items-center w-14 h-7 rounded-full p-1 transition-all duration-300 shrink-0',
      'border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      isLight
        ? 'bg-amber-100 border-amber-300 hover:border-amber-400'
        : 'bg-neon-purple/20 border-neon-purple/40 hover:border-neon-purple/70',
    )"
    @click="toggle"
  >
    
    <Sun
      :class="cn(
        'absolute left-1.5 w-3.5 h-3.5 transition-all duration-300',
        isLight ? 'text-amber-500 opacity-100 scale-100' : 'text-muted-foreground opacity-40 scale-75',
      )"
      aria-hidden="true"
    />

    
    <Moon
      :class="cn(
        'absolute right-1.5 w-3.5 h-3.5 transition-all duration-300',
        !isLight ? 'text-neon-mint opacity-100 scale-100' : 'text-muted-foreground opacity-40 scale-75',
      )"
      aria-hidden="true"
    />

    
    
    <span
      :class="cn(
        'relative z-10 w-5 h-5 rounded-full shadow-md transition-all duration-300',
        'ease-[cubic-bezier(0.34,1.56,0.64,1)]',
        isLight
          ? 'translate-x-0 bg-amber-400'
          : 'translate-x-[34px] bg-neon-purple glow-purple',
      )"
      aria-hidden="true"
    />
  </button>
</template>
