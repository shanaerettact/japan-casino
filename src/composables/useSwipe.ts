import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null

export interface UseSwipeOptions {
  threshold?: number        // min px distance to count as swipe (default 50)
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

/**
 * Attach pointer-based swipe detection to a template ref element.
 * Works with both touch and mouse drag. Passive listeners for scroll perf.
 */
export function useSwipe(
  targetRef: Ref<HTMLElement | null>,
  options: UseSwipeOptions = {},
) {
  const { threshold = 50, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown } = options

  const direction = ref<SwipeDirection>(null)
  const isSwiping = ref(false)

  let startX = 0
  let startY = 0
  let startTime = 0

  function onPointerDown(e: PointerEvent) {
    startX = e.clientX
    startY = e.clientY
    startTime = Date.now()
    isSwiping.value = true
    direction.value = null
  }

  function onPointerUp(e: PointerEvent) {
    if (!isSwiping.value) return
    isSwiping.value = false

    const elapsed = Date.now() - startTime
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    // Ignore slow deliberate drags that aren't swipes (> 600ms)
    if (elapsed > 600) return

    if (absDx > absDy && absDx >= threshold) {
      if (dx < 0) {
        direction.value = 'left'
        onSwipeLeft?.()
      } else {
        direction.value = 'right'
        onSwipeRight?.()
      }
    } else if (absDy > absDx && absDy >= threshold) {
      if (dy < 0) {
        direction.value = 'up'
        onSwipeUp?.()
      } else {
        direction.value = 'down'
        onSwipeDown?.()
      }
    }
  }

  function onPointerCancel() {
    isSwiping.value = false
  }

  onMounted(() => {
    const el = targetRef.value
    if (!el) return
    el.addEventListener('pointerdown', onPointerDown, { passive: true })
    el.addEventListener('pointerup', onPointerUp, { passive: true })
    el.addEventListener('pointercancel', onPointerCancel, { passive: true })
  })

  onUnmounted(() => {
    const el = targetRef.value
    if (!el) return
    el.removeEventListener('pointerdown', onPointerDown)
    el.removeEventListener('pointerup', onPointerUp)
    el.removeEventListener('pointercancel', onPointerCancel)
  })

  return { direction, isSwiping }
}
