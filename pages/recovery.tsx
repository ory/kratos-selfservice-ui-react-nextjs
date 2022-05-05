import {
  SelfServiceRecoveryFlow,
  SubmitSelfServiceRecoveryFlowBody
} from '@ory/client'
import { CardTitle } from '@ory/themes'
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
import { handleFlowError } from '../pkg/errors'
import ory from '../pkg/sdk'

const Recovery: NextPage = () => {
  const [flow, setFlow] = useState<SelfServiceRecoveryFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    OryGetOrInitializeFlow<SelfServiceRecoveryFlow>('recovery', router, setFlow)
      .then(setFlow)
      .catch((err: AxiosError) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          // Yup, it is!
          setFlow(err.response?.data)
          return
        }

        return Promise.reject(err)
      })
  }, [router, router.isReady, router.query, flow])

  const onSubmit = (values: SubmitSelfServiceRecoveryFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/recovery?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .submitSelfServiceRecoveryFlow(String(flow?.id), undefined, values)
          .then(({ data }) => {
            // Form submission was successful, show the message to the user!
            setFlow(data)
          })
          .catch(handleFlowError(router, 'recovery', setFlow))
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
        <title>Recover your account - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <MarginCard>
        <CardTitle>Recover your account</CardTitle>
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

export default Recovery
