import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'styled-components'
import { theme, globalStyles, ThemeProps } from '@ory/themes'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle((props: ThemeProps) =>
  globalStyles(props)
)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
