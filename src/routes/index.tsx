import { localeToNativeNameMap } from '@i18n/constants'
import { i18nContext } from '@i18n/context'
import type { Locale } from '@i18n/types'
import { A } from '@solidjs/router'
import { For, useContext } from 'solid-js'

export default function Home() {
  const { t, locale, changeLocale } = useContext(i18nContext)!

  return (
    <>
      <title>{t.title()}</title>

      <main class='mx-auto max-w-5xl pb-20 flex flex-col gap-y-20 px-6'>
        <picture>
          <source
            srcset='/hero@2x.webp'
            media='(min-width: 1024px)'
            width={1500}
            height={500}
          />
          <source
            srcset='/hero@1.5x.webp'
            media='(min-width: 640px)'
            width={1125}
            height={375}
          />
          <img
            src='/hero@1x.webp'
            alt='Hero'
            width={750}
            height={250}
            class='-mb-10 w-full object-contain'
            loading='eager'
            decoding='sync'
          />
        </picture>

        <section>
          <h2>{t.home.about.title()}</h2>
          <p>{t.home.about.body()}</p>
        </section>

        <section>
          <h2>{t.home.careers.title()}</h2>
          <p>
            {t.home.careers.body.start({
              A: props => <span class='font-bold'>{props.children}</span>,
            })}
          </p>

          <div class='px-8 py-6 flex flex-col gap-y-3 bg-white/[0.08] rounded-lg'>
            <h3 class='font-bold'>{t.home.hiring.title()}</h3>
            <ul class='flex flex-col gap-y-3'>
              <For each={Object.entries(t.home.hiring.open)}>
                {([key, name]) => (
                  <li class='flex items-center justify-between gap-x-6'>
                    {name()}
                    <A href={`/${key}`} class='underline' target='_blank'>
                      {t.home.hiring.view()}
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </div>

          <p>
            {t.home.careers.body.end({
              A: props => (
                <a href={'mailto:careers@timelesslab.ai'} class='underline'>
                  {props.children}
                </a>
              ),
            })}
          </p>
        </section>

        <section>
          <h2>{t.home.contact.title()}</h2>
          <p>
            {t.home.contact.body({
              A: props => (
                <a href={'mailto:hello@timelesslab.ai'} class='underline'>
                  {props.children}
                </a>
              ),
            })}
          </p>
        </section>

        <footer class='flex flex-col items-center gap-y-4'>
          <div class='flex items-baseline gap-x-1'>
            <For each={Object.entries(localeToNativeNameMap)}>
              {([l, name]) => (
                <>
                  <button
                    type='button'
                    class={l === locale() ? 'underline' : undefined}
                    disabled={l === locale()}
                    onClick={() => changeLocale(l as Locale)}
                  >
                    {name}
                  </button>
                  <span class='last:hidden'>/</span>
                </>
              )}
            </For>
          </div>

          <p class='text-zinc-400'>© 2024 TimelessLab.ai</p>
        </footer>
      </main>
    </>
  )
}
