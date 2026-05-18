import ja from './ja'
import zhTW from './zh-TW'
import en from './en'

export type LangCode = 'ja' | 'zh-TW' | 'en'
export type Locale = typeof ja

export const LANG_STORAGE = 'nekoverse-ui-lang'

export const languages: { code: LangCode; label: string; note: string }[] = [
  { code: 'ja', label: '日本語', note: 'UI 表示の標準' },
  { code: 'zh-TW', label: '繁體中文', note: 'Traditional Chinese' },
  { code: 'en', label: 'English', note: 'Interface language' },
]

export const locales: Record<LangCode, Locale> = {
  ja,
  'zh-TW': zhTW,
  en,
}
