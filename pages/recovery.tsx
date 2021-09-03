import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { SelfServiceRecoveryFlow } from '@ory/client'
import { Card, CardTitle } from '@ory/themes'
import { Flow } from '../pkg/ui/Flow'
import { AxiosError } from 'axios'
import { ActionCard, CenterLink, MarginCard } from '../pkg/styled'
import Link from 'next/link'

// Or if you use the open source:
//
// import {ory} from "../../pkg/open-source";
import { ory } from '../pkg/cloud'
import Head from 'next/head'

const Recovery: NextPage = () => {
  const [flow, setFlow] = useState<SelfServiceRecoveryFlow>()

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
        .getSelfServiceRecoveryFlow(String(flowId))
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 410:
            // Status code 410 means the request has expired - so let's load a fresh flow!
            case 403:
              // Status code 403 implies some other issue (e.g. CSRF) - let's reload!
              return router.push('/recovery')
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
      .initializeSelfServiceRecoveryFlowForBrowsers()
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

  return (
    <>
      <Head>
        <title>Recover your account - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <MarginCard>
        <CardTitle>Recover your account</CardTitle>
        <Flow flow={flow} />
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
