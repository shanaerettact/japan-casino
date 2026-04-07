import { ref, watch, provide, inject, type InjectionKey, type Ref } from 'vue'

export type Theme = 'dark' | 'light'

export interface ThemeContext {
  theme: Ref<Theme>
  toggle: () => void
}

export const ThemeKey: InjectionKey<ThemeContext> = Symbol('theme')

const STORAGE_KEY = 'nv-theme'

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage unavailable (SSR / private browsing)
  }
  return 'dark'
}

/**
 * Call once at the root (App.vue) to create and provide the theme state.
 */
export function provideTheme(): ThemeContext {
  const theme = ref<Theme>(readStoredTheme())

  // Sync <html> class and localStorage whenever theme changes.
  watch(
    theme,
    (val) => {
      const root = document.documentElement
      if (val === 'light') {
        root.classList.add('light')
        root.classList.remove('dark')
      } else {
        root.classList.add('dark')
        root.classList.remove('light')
      }
      try {
        localStorage.setItem(STORAGE_KEY, val)
      } catch {
        // ignore
      }
    },
    { immediate: true },
  )

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const ctx: ThemeContext = { theme, toggle }
  provide(ThemeKey, ctx)
  return ctx
}

/**
 * Call in any child component to consume the theme state.
 */
export function useTheme(): ThemeContext {
  const ctx = inject(ThemeKey)
  if (!ctx) throw new Error('useTheme() must be called inside a component tree where provideTheme() was called.')
  return ctx
}
