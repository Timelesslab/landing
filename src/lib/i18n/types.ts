import type * as base from './strings/en.json'
import type { locales } from './constants'
import type { FlowComponent } from 'solid-js'
import type { BaseRecordDict, Resolved, Template } from '@solid-primitives/i18n'

export type Locale = (typeof locales)[number]
export type I18nDictionary = typeof base

export type I18nNode =
  | string
  | {
      tag: string
      children: I18nNode[]
    }
  | I18nNode[]

export type TemplateArgs = Record<string, string | number | FlowComponent>

type ResolveArgs<T, O> = T extends (...args: infer A) => unknown
  ? A
  : T extends Template<infer R>
    ? [args: R]
    : T extends O
      ? [args?: TemplateArgs]
      : []
type Resolver<T, O> = (...args: ResolveArgs<T, O>) => Resolved<T, O>

export type ChainedTranslator<T extends BaseRecordDict, O = string> = {
  readonly [K in keyof T]: T[K] extends BaseRecordDict
    ? ChainedTranslator<T[K], O>
    : Resolver<T[K], O>
}
