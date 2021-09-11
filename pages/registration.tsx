import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRecoveryFlowBody,
  SubmitSelfServiceRegistrationFlowBody
} from '@ory/client'
import { CardTitle } from '@ory/themes'
import { Flow } from '../pkg/ui/Flow'
import { ActionCard, CenterLink, MarginCard } from '../pkg/styled'

// Or if you use the open source:
//
// import {ory} from "../../pkg/open-source";
import { ory } from '../pkg/cloud'
import { AxiosError } from 'axios'
import Head from 'next/head'

const Registration: NextPage = () => {
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId } = router.query

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
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 410:
              // Status code 410 means the request has expired - so let's load a fresh flow!
              return router.push('/registration')
            case 403:
              // Status code 403 implies some other issue (e.g. CSRF) - let's reload!
              return router.push('/registration')
            case 400:
              // Status code 400 implies the user is already signed in - let's bring him home.
              return router.push('/')
          }

          throw err
        })
      return
    }

    // Otherwise we initialize it
    ory
      .initializeSelfServiceRegistrationFlowForBrowsers()
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
  }, [flowId, router.isReady])

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
            // console.log(data.identity)

            // For now however we just want to redirect home!
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
