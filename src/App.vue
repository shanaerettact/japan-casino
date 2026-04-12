<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { provideTheme } from '@/composables/useTheme'
import { cn } from '@/lib/utils'
import { ChevronsUp } from 'lucide-vue-next'
import NavBar from '@/components/NavBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'

provideTheme()

// Scroll-to-top FAB visibility
const showFab = ref(false)

function handleScroll() {
  showFab.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <NavBar />

    <main id="main-content" class="pb-16 md:pb-0">
      <RouterView />
    </main>

    <SiteFooter />

    <!-- Scroll-to-top FAB — mobile & desktop -->
    <Teleport to="body">
      <Transition name="fab">
        <button
          v-if="showFab"
          type="button"
          aria-label="Scroll to top"
          :class="cn(
            'fixed right-4 z-40 w-11 h-11 rounded-2xl flex items-center justify-center',
            'bg-neon-purple text-primary-foreground glow-purple',
            'transition-all duration-300 hover:scale-110 active:scale-95 touch-press animate-pop-in',
            // sit above bottom nav on mobile, regular position on desktop
            'bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6',
          )"
          @click="scrollToTop"
        >
          <ChevronsUp class="w-5 h-5" aria-hidden="true" />
        </button>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* FAB transition */
.fab-enter-active,
.fab-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: scale(0.6) translateY(8px);
}
</style>
