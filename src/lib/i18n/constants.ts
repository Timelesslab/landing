import type { Locale } from './types'

export const locales = ['en', 'zh-CN'] as const

export const COOKIE_NAME_LOCALE = 'locale'

export const localeToNativeNameMap: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '中文',
}
