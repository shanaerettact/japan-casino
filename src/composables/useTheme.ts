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
  } catch {}
  return 'dark'
}

export function provideTheme(): ThemeContext {
  const theme = ref<Theme>(readStoredTheme())

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
      } catch {}
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

export function useTheme(): ThemeContext {
  const ctx = inject(ThemeKey)
  if (!ctx) throw new Error('useTheme() must be called inside a component tree where provideTheme() was called.')
  return ctx
}
