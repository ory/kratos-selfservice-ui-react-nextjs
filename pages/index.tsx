import { Card, CardTitle, P, H2, H3, CodeBox } from '@ory/themes'
import { AxiosError } from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { DocsButton, MarginCard, createLogoutHandler } from '../pkg'
import ory from '../pkg/sdk'

import getConfig from 'next/config'
const {  publicRuntimeConfig } = getConfig()

const Home: NextPage = () => {
  const [session, setSession] = useState<string>(
    'No valid Session was found.\nPlease sign in to receive one.'
  )
  const [hasSession, setHasSession] = useState<boolean>(false)
  const router = useRouter()
  const onLogout = createLogoutHandler()

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setSession(JSON.stringify(data, null, 2))
        setHasSession(true)

        if (publicRuntimeConfig.NEXT_PUBLIC_AFTER_LOGGED_IN_URL) {
          window.location.href = publicRuntimeConfig.NEXT_PUBLIC_AFTER_LOGGED_IN_URL
          return
        }
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 403:
          // This is a legacy error code thrown. See code 422 for
          // more details.
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // it's second factor
            return router.push('/login?aal=aal2')
          case 401:
            return router.push('/login')
        }

        // Something else happened!
        return Promise.reject(err)
      })
  })

  return (
    <div className={'container-fluid'}>
      <Head>
        <title>Miss Moneypenny</title>
        <meta name="description" content="" />
      </Head>

      <Card wide>
        <H2>Other User Interface Screens</H2>
        <div className={'row'}>
          <DocsButton
            unresponsive
            testid="login"
            href="/login"
            disabled={hasSession}
            title={'Login'}
          />
          <DocsButton
            unresponsive
            testid="sign-up"
            href="/registration"
            disabled={hasSession}
            title={'Sign Up'}
          />
          <DocsButton
            unresponsive
            testid="recover-account"
            href="/recovery"
            disabled={hasSession}
            title="Recover Account"
          />
          <DocsButton
            unresponsive
            testid="verify-account"
            href="/verification"
            title="Verify Account"
          />
          {/* <DocsButton
            unresponsive
            testid="account-settings"
            href="/settings"
            disabled={!hasSession}
            title={'Account Settings'}
          /> */}
          <DocsButton
            unresponsive
            testid="logout"
            onClick={onLogout}
            disabled={!hasSession}
            title={'Logout'}
          />
        </div>
      </Card>
    </div>
  )
}

// Prevents static rendering so that env vars can be included
Home.getInitialProps = async ({ req }) => {
  return {  }
}

export default Home
