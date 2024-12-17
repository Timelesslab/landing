import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
  useTransition,
  type FlowComponent,
  type JSXElement,
} from 'solid-js'
import {
  chainedTranslator,
  flatten,
  type BaseRecordDict,
  type Translator,
} from '@solid-primitives/i18n'
import type {
  ChainedTranslator,
  I18nDictionary,
  Locale,
  TemplateArgs,
} from '@i18n/types'
import { i18nContext, i18nNodeContext } from '@i18n/context'
import * as en from '@i18n/strings/en.json'
import { getCookie, setCookie } from 'typescript-cookie'
import { COOKIE_NAME_LOCALE } from '@i18n/constants'
import { parseI18nNodes } from '@i18n/helpers'
import { I18nNodeRenderer } from './I18nNodeRenderer'

function translator<T extends BaseRecordDict>(
  dict: () => T | undefined,
): Translator<T, JSXElement>
function translator<T extends BaseRecordDict>(
  dict: () => T | undefined,
  pureText: true,
): Translator<T, string>
function translator<T extends BaseRecordDict>(
  dict: () => T | undefined,
  pureText = false,
) {
  return (path: string, args?: TemplateArgs) => {
    let p = path
    if (p[0] === '.') p = p.slice(1)

    const value = dict()?.[p]

    switch (typeof value) {
      case 'function':
        return value(args)
      case 'string': {
        if (args === undefined) {
          return value
        }

        const flat = Object.entries(args)
        const templates = flat.filter(
          ([, value]) => typeof value !== 'function',
        )

        let result = value
        for (const [key, value] of templates) {
          result = result.replace(`{${key}}`, value.toString())
        }

        const components = flat.filter(
          ([, value]) => typeof value === 'function',
        )
        if (pureText || components.length === 0) {
          return result
        }
        const nodes = parseI18nNodes(result)

        return (
          <i18nNodeContext.Provider
            value={
              Object.fromEntries(components) as Record<string, FlowComponent>
            }
          >
            <I18nNodeRenderer node={nodes} />
          </i18nNodeContext.Provider>
        )
      }
      default:
        return value
    }
  }
}

export const I18nProvider: FlowComponent<{
  locale: Locale
}> = props => {
  //#region Dictionary
  const [locale, setLocale] = createSignal<Locale>(props.locale)

  const [resource] = createResource(
    locale,
    async () =>
      (await import(
        `@i18n/strings/${locale()}.json`
      )) as Promise<I18nDictionary>,
    {
      initialValue: en as I18nDictionary,
    },
  )

  const isLoading = createMemo(() => locale() !== 'en' && resource.loading)
  const flat = createMemo(() => flatten(resource()))
  const t = chainedTranslator(
    resource(),
    translator(flat),
  ) as ChainedTranslator<I18nDictionary, JSXElement>

  createEffect(() => {
    if (locale() === getCookie(COOKIE_NAME_LOCALE)) {
      return
    }

    setCookie(COOKIE_NAME_LOCALE, locale(), {
      expires: 60 * 60 * 24 * 365,
      path: '/',
    })
  })
  //#endregion

  //#region Change locale
  const [during, start] = useTransition()

  function changeLocale(locale: Locale) {
    start(() => setLocale(locale))
    globalThis?.document?.documentElement?.setAttribute?.('lang', locale)
  }
  //#endregion

  return (
    <>
      <i18nContext.Provider
        value={{
          isLoading,
          isChanging: during,
          locale,
          changeLocale,
          t,
        }}
      >
        {props.children}
      </i18nContext.Provider>
    </>
  )
}
