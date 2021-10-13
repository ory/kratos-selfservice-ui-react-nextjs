import '../styles/globals.css'
import { theme, globalStyles, ThemeProps } from '@ory/themes'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from 'styled-components'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle((props: ThemeProps) =>
  globalStyles(props)
)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div data-testid="app-react">
        <Component {...pageProps} />
      </div>
      <ToastContainer />
    </ThemeProvider>
  )
}

export default MyApp
