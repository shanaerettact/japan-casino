import { ref, provide, inject, type InjectionKey, type Ref } from 'vue'
import { locales, LANG_STORAGE, type LangCode, type Locale } from '@/locales'

export interface I18nContext {
  lang: Ref<LangCode>
  setLang: (code: LangCode) => void
  t: (key: string) => string
}

export const I18nKey: InjectionKey<I18nContext> = Symbol('i18n')

function readStoredLang(): LangCode {
  try {
    const stored = localStorage.getItem(LANG_STORAGE)
    if (stored === 'ja' || stored === 'zh-TW' || stored === 'en') return stored
  } catch {}
  return 'ja'
}

function getByPath(locale: Locale, key: string): string {
  const parts = key.split('.')
  let current: unknown = locale
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return key
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === 'string' ? current : key
}

export function provideI18n(): I18nContext {
  const lang = ref<LangCode>(readStoredLang())

  function setLang(code: LangCode) {
    lang.value = code
    try {
      localStorage.setItem(LANG_STORAGE, code)
    } catch {}
  }

  function t(key: string): string {
    return getByPath(locales[lang.value], key)
  }

  const ctx: I18nContext = { lang, setLang, t }
  provide(I18nKey, ctx)
  return ctx
}

export function useI18n(): I18nContext {
  const ctx = inject(I18nKey)
  if (!ctx) throw new Error('useI18n() must be called inside a component tree where provideI18n() was called.')
  return ctx
}
