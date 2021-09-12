import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  SelfServiceLoginFlow,
  SubmitSelfServiceLoginFlowBody
} from '@ory/client'
import { Card, CardTitle } from '@ory/themes'
import { Flow, Values } from '../pkg/ui/Flow'
import { AxiosError } from 'axios'
import { ActionCard, CenterLink, MarginCard } from '../pkg/styled'
import Link from 'next/link'

// Or if you use the open source:
//
// import {ory} from "../../pkg/open-source";
import { ory } from '../pkg/cloud'
import Head from 'next/head'

const Login: NextPage = () => {
  const [flow, setFlow] = useState<SelfServiceLoginFlow>()

  // This might be confusing, but we want to show the user an option
  // to sign out if they are performing two-factor authentication!
  const [logoutUrl, setLogoutUrl] = useState<string>('')

  // Get ?flow=... from the URL
  const router = useRouter()
  const {
    flow: flowId,
    // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
    // of a user.
    refresh,
    // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
    // to perform two-factor authentication/verification.
    aal
  } = router.query

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSelfServiceLoginFlow(String(flowId))
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 410:
            // Status code 410 means the request has expired - so let's load a fresh flow!
            case 403:
              // Status code 403 implies some other issue (e.g. CSRF) - let's reload!
              return router.push('/login')
            case 400:
              // Status code 400 implies the user is already signed in
              return router.push('/')
          }

          throw err
        })
      return
    }

    // Otherwise we initialize it
    ory
      .initializeSelfServiceLoginFlowForBrowsers(
        Boolean(refresh),
        aal ? String(aal) : undefined
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 400:
            // Status code 400 implies the user is already signed in
            return router.push('/')
        }

        throw err
      })

    // This might be confusing but we want to show a logout link
    // when the user is performing MFA or refreshing her/his session.
    if (aal || refresh) {
      ory
        .createSelfServiceLogoutFlowUrlForBrowsers()
        .then(({ data }) => {
          setLogoutUrl(String(data.logout_url))
        })
        .catch(() => {
          // Do nothing.
        })
    }
  }, [flowId, router, router.isReady, aal, refresh])

  const onSubmit = (values: SubmitSelfServiceLoginFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/login?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() => {
        ory
          .submitSelfServiceLoginFlow(String(flow?.id), undefined, values)
          .then(() => {
            // We logged in successfully! Let's bring the user home.
            return router.push('/').then(() => {})
          })
          .catch((err: AxiosError) => {
            switch (err.response?.status) {
              case 400:
                // Status code 400 implies the form validation had an error
                setFlow(err.response?.data)
                return
            }

            throw err
          })
      })

  return (
    <>
      <Head>
        <title>Sign in - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <MarginCard>
        <CardTitle>Sign In</CardTitle>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      {aal || refresh ? (
        <ActionCard>
          <CenterLink href={logoutUrl}>Log out</CenterLink>
        </ActionCard>
      ) : (
        <>
          <ActionCard>
            <Link href="/registration" passHref>
              <CenterLink>Create account</CenterLink>
            </Link>
          </ActionCard>
          <ActionCard>
            <Link href="/recover" passHref>
              <CenterLink>Recover your account</CenterLink>
            </Link>
          </ActionCard>
        </>
      )}
    </>
  )
}

export default Login
