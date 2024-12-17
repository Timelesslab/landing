import {
  createContext,
  type Accessor,
  type FlowComponent,
  type JSXElement,
} from 'solid-js'
import type { ChainedTranslator, I18nDictionary, Locale } from './types'

export type I18nContextData = {
  isLoading: Accessor<boolean>
  isChanging: Accessor<boolean>
  locale: Accessor<Locale>
  changeLocale: (locale: Locale) => void
  t: ChainedTranslator<I18nDictionary, JSXElement>
}

export const i18nContext = createContext<I18nContextData>()

export const i18nNodeContext = createContext<Record<string, FlowComponent>>()
