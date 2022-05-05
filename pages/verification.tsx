import {
  SelfServiceVerificationFlow,
  SubmitSelfServiceVerificationFlowBody
} from '@ory/client'
import { Card, CardTitle } from '@ory/themes'
import { AxiosError } from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import {
  Flow,
  ActionCard,
  CenterLink,
  MarginCard,
  OryGetOrInitializeFlow
} from '../pkg'
import ory from '../pkg/sdk'

const Verification: NextPage = () => {
  const [flow, setFlow] = useState<SelfServiceVerificationFlow>()
  const router = useRouter()

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    OryGetOrInitializeFlow<SelfServiceVerificationFlow>(
      'verification',
      router,
      setFlow
    )
      .then(setFlow)
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 400: // Status code 400 implies the user is already signed in
            router.push('/')
            break
          default:
            return Promise.reject(err)
            break
        }
      })
  }, [router, router.isReady, router.query, flow])

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
