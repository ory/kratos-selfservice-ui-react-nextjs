import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  SelfServiceVerificationFlow,
  SubmitSelfServiceVerificationFlowBody,
  SubmitSelfServiceSettingsFlowBody
} from '@ory/client'
import { Card, CardTitle } from '@ory/themes'
import { Flow } from '../pkg/ui/Flow'
import { AxiosError } from 'axios'
import { ActionCard, CenterLink, MarginCard } from '../pkg/styled'
import Link from 'next/link'

import ory from '../pkg/sdk'
import Head from 'next/head'

const Verification: NextPage = () => {
  const [flow, setFlow] = useState<SelfServiceVerificationFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId } = router.query

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSelfServiceVerificationFlow(String(flowId))
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 410:
            // Status code 410 means the request has expired - so let's load a fresh flow!
            case 403:
              // Status code 403 implies some other issue (e.g. CSRF) - let's reload!
              return router.push('/verification')
          }

          throw err
        })
      return
    }

    // Otherwise we initialize it
    ory
      .initializeSelfServiceVerificationFlowForBrowsers()
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
  }, [flowId, router, router.isReady])

  const onSubmit = (values: SubmitSelfServiceVerificationFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/verification?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .submitSelfServiceVerificationFlow(
            String(flow?.id),
            undefined,
            values
          )
          .then(({ data }) => {
            // Form submission was successful, show the message to the user!
            setFlow(data)
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
        <title>Verify your account - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <MarginCard>
        <CardTitle>Verify your account</CardTitle>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      <ActionCard>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}

export default Verification
