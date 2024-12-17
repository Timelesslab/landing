import { getCookie, setCookie } from 'vinxi/http'
import type { I18nNode, Locale } from './types'
import { COOKIE_NAME_LOCALE, locales } from './constants'
import { getRequestEvent } from 'solid-js/web'

export function getServerLocale(): Locale {
  'use server'

  let locale = getCookie(COOKIE_NAME_LOCALE) as Locale | undefined

  if (locale === undefined) {
    const accept = getRequestEvent()
      ?.request.headers.get('accept-language')
      ?.split(',')
      .map(p => p.split(';')[0])

    locale =
      (accept?.find(l => locales.includes(l as Locale)) as
        | Locale
        | undefined) ?? 'en'

    setCookie(COOKIE_NAME_LOCALE, locale, {
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  return locale
}

const NODE_REGEX = /<(\w+)>(.*?)<\/\1>/

export function parseI18nNodes(source: string): I18nNode[] {
  if (!NODE_REGEX.test(source)) {
    return [source]
  }

  const matched = NODE_REGEX.exec(source)
  if (matched === null) {
    return [source]
  }

  const [full, tag, children] = matched

  const parts: I18nNode[] = source.split(full)
  parts.splice(1, 0, {
    tag,
    children: parseI18nNodes(children),
  } satisfies I18nNode)

  return parts.filter(Boolean)
}
