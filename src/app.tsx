import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import './app.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/700.css'
import { I18nProvider } from '@components/I18nProvider'
import { isServer } from 'solid-js/web'
import { getServerLocale } from '@i18n/helpers'
import { COOKIE_NAME_LOCALE } from '@i18n/constants'
import type { Locale } from '@i18n/types'
import { getCookie } from 'typescript-cookie'

export default function App() {
  return (
    <Router
      root={props => (
        <>
          <Suspense>
            <I18nProvider
              locale={
                (isServer
                  ? getServerLocale()
                  : getCookie(COOKIE_NAME_LOCALE)) as Locale
              }
            >
              {props.children}
            </I18nProvider>
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
