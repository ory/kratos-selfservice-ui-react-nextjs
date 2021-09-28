import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody
} from '@ory/client'
import { CardTitle } from '@ory/themes'
import { AxiosError } from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter, NextRouter } from 'next/router'
import { useEffect, useState } from 'react'

// Import render helpers
import { Flow, ActionCard, CenterLink, MarginCard } from '../pkg'
// Import the SDK
import ory from '../pkg/sdk'

// A small function to help us deal with errors.
const handleError = (router: NextRouter, err: AxiosError) => {
  switch (err.response?.status) {
    case 410:
    // Status code 410 means the request has expired - so let's load a fresh flow!
    case 403:
      // Status code 403 implies some other issue (e.g. CSRF) - let's reload!
      return router.push('/registration')
    case 400:
      // Status code 400 implies the user is already signed in - let's bring him home.
      return router.push('/')
  }

  throw err
}

// Renders the registration page
const Registration: NextPage = () => {
  const router = useRouter()

  // The "flow" represents a registration process and contains
  // information about the form we need to render (e.g. username + password)
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow>()

  // Get ?flow=... from the URL
  const { flow: flowId, return_to: returnTo } = router.query

  // In this effect we either initiate a new registration flow, or we fetch an existing registration flow.
  useEffect(() => {
    // If the router is not ready yet, do nothing.
    if (!router.isReady) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSelfServiceRegistrationFlow(String(flowId))
        .then(({ data }) => {
          // We received the flow - let's use its data and render the form!
          setFlow(data)
        })
        .catch((err) => handleError(router, err))
      return
    }

    // Otherwise we initialize it
    ory
      .initializeSelfServiceRegistrationFlowForBrowsers(
        returnTo ? String(returnTo) : undefined
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch((err) => handleError(router, err))
  }, [flowId, router, router.isReady])

  const onSubmit = (values: SubmitSelfServiceRegistrationFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/registration?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .submitSelfServiceRegistrationFlow(String(flow?.id), values)
          .then(({ data }) => {
            // If we ended up here, it means we are successfully signed up!
            //
            // You can do cool stuff here, like having access to the identity which just signed up:
            console.log('This is the user session: ', data, data.identity)

            // For now however we just want to redirect home!
            return router.push('/').then(() => {})
          })
          .catch((err: AxiosError) => {
            switch (err.response?.status) {
              case 400:
                // Status code 400 implies the form validation had an error
                setFlow(err.response?.data)
                return
              case 403:
                // Status code 403 implies some other issue (e.g. CSRF) - let's reload!
                router.push('/login')
                return
            }

            throw err
          })
      )

  return (
    <>
      <Head>
        <title>Create account - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <MarginCard>
        <CardTitle>Create account</CardTitle>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      <ActionCard>
        <CenterLink href="/login">Sign in</CenterLink>
      </ActionCard>
    </>
  )
}

export default Registration
