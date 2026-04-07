<script setup lang="ts">
import { ref } from 'vue'
import { Star, Users, Clock, Zap } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

export interface Game {
  id: number
  title: string
  titleJp: string
  genre: string
  rating: number
  players: string
  releaseDate: string
  tag: 'NEW' | 'HOT' | 'UPDATE' | 'FREE'
  tagColor: 'purple' | 'mint' | 'amber' | 'sky'
  image: string
  description: string
}

const props = defineProps<{ game: Game; index: number }>()

// Desktop hover + mobile touch-active state unified
const active  = ref(false)
const pressed = ref(false)

function onPress()    { pressed.value = true  }
function onRelease()  { pressed.value = false }

const tagStyles: Record<Game['tagColor'], string> = {
  mint:   'bg-neon-mint/20 text-neon-mint border-neon-mint/30',
  purple: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
  amber:  'bg-amber-400/20 text-amber-400 border-amber-400/30',
  sky:    'bg-sky-400/20 text-sky-400 border-sky-400/30',
}
</script>

<template>
  <article
    :class="cn(
      'relative flex-shrink-0 w-[calc(100vw-56px)] sm:w-80 rounded-2xl overflow-hidden cursor-pointer',
      'bg-surface-1 border border-border',
      'transition-all duration-300 ease-out select-none',
      active || pressed
        ? 'border-neon-purple/50 glow-purple scale-[1.02] -translate-y-1'
        : '',
      pressed ? 'scale-[0.975]' : '',
    )"
    :aria-label="`${props.game.title} — ${props.game.genre}`"
    :style="{ animationDelay: `${props.index * 0.08}s` }"
    @mouseenter="active = true"
    @mouseleave="active = false"
    @pointerdown="onPress"
    @pointerup="onRelease"
    @pointercancel="onRelease"
    @pointerleave="onRelease"
  >
    <!-- Thumbnail -->
    <div class="relative h-44 overflow-hidden">
      <img
        :src="props.game.image"
        :alt="`${props.game.title} game thumbnail`"
        :class="cn(
          'w-full h-full object-cover transition-transform duration-500',
          active || pressed ? 'scale-110' : 'scale-100',
        )"
      />
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-linear-to-t from-surface-1 via-transparent to-transparent" />

      <!-- Tag -->
      <span
        :class="cn(
          'absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-display font-bold tracking-widest border',
          tagStyles[props.game.tagColor],
        )"
        :aria-label="`${props.game.tag} game`"
      >
        {{ props.game.tag }}
      </span>

      <!-- Rating -->
      <div class="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg">
        <Star class="w-3 h-3 text-amber-400 fill-amber-400" aria-hidden="true" />
        <span class="text-xs font-display font-bold text-foreground">{{ props.game.rating }}</span>
      </div>

      <!-- Play overlay — visible on hover/press -->
      <div
        :class="cn(
          'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
          active || pressed ? 'opacity-100' : 'opacity-0',
        )"
        aria-hidden="true"
      >
        <div :class="cn(
          'w-14 h-14 rounded-full bg-neon-purple/80 border-2 border-neon-purple flex items-center justify-center glow-purple',
          'transition-transform duration-300',
          pressed ? 'scale-90' : 'scale-100',
        )">
          <Zap class="w-6 h-6 text-primary-foreground fill-primary-foreground" />
        </div>
      </div>
    </div>

    <!-- Card body -->
    <div class="p-4">
      <div class="flex items-start justify-between gap-2 mb-1">
        <div>
          <h3 class="font-display font-black text-base text-foreground leading-tight tracking-wide">
            {{ props.game.title }}
          </h3>
          <p class="text-xs font-body text-neon-purple mt-0.5">{{ props.game.titleJp }}</p>
        </div>
        <span class="text-xs font-body text-muted-foreground bg-surface-2 px-2 py-0.5 rounded-lg shrink-0">
          {{ props.game.genre }}
        </span>
      </div>

      <p class="text-xs font-body text-muted-foreground leading-relaxed mt-2 line-clamp-1">
        {{ props.game.description }}
      </p>

      <div class="flex items-center gap-4 mt-3 pt-3 border-t border-border">
        <div class="flex items-center gap-1 text-xs font-body text-muted-foreground">
          <Users class="w-3.5 h-3.5 text-neon-mint" aria-hidden="true" />
          <span>{{ props.game.players }}</span>
        </div>
        <div class="flex items-center gap-1 text-xs font-body text-muted-foreground">
          <Clock class="w-3.5 h-3.5 text-neon-purple" aria-hidden="true" />
          <span>{{ props.game.releaseDate }}</span>
        </div>
        <button
          type="button"
          class="ml-auto text-xs font-display font-bold text-neon-mint touch-press transition-colors duration-200"
          :aria-label="`Play ${props.game.title} now`"
        >
          PLAY →
        </button>
      </div>
    </div>

    <!-- Bottom neon accent bar -->
    <div
      :class="cn(
        'absolute bottom-0 left-0 right-0 h-[2px] transition-opacity duration-300',
        'bg-linear-to-r from-neon-purple via-neon-mint to-neon-purple',
        active || pressed ? 'opacity-100' : 'opacity-0',
      )"
      aria-hidden="true"
    />
  </article>
</template>
