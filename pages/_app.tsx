import '../styles/globals.css'
import { globalStyles, ThemeProps } from '@ory/themes'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from 'styled-components'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle((props: ThemeProps) =>
  globalStyles(props)
)

function MyApp({ Component, pageProps }: AppProps) {
  const customStyles = {
    blue30: '#9DC2FF',
    blue60: '#2979FF',
    blue70: '#2264D1',
    blueGrey30: '#B4BBE2',
    blueGrey60: '#97A0D6',
    borderRadius: '4px',
    codeFont400: "'Roboto Mono', sans-serif",
    green30: '#A9D3AB',
    green60: '#43A047',
    green70: '#37833B',
    grey0: '#F9F9FA',
    grey5: '#F0F0F1',
    grey10: '#E1E1E3',
    grey30: '#B4B4BB',
    grey60: '#5A5B6A',
    grey70: '#4A4B57',
    grey100: '#19191D',
    primary30: '#219487',
    primary60: '#219487',
    primary70: '#219487',
    primaryAccent: '#FF80FF',
    red30: '#FAA9A3',
    red60: '#F44336',
    red70: '#C8372D',
    regularFont300: "'Rubik', sans-serif",
    regularFont400: "'Rubik', sans-serif",
    regularFont500: "'Rubik', sans-serif"
  }
  return (
    <div data-testid="app-react">
      <ThemeProvider theme={customStyles}>
        <GlobalStyle />
        <Component {...pageProps} />
        <ToastContainer />
      </ThemeProvider>
    </div>
  )
}

export default MyApp
