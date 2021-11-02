import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody
} from '@ory/kratos-client'
import { CardTitle } from '@ory/themes'
import { AxiosError } from 'axios'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// Import render helpers
import { Flow, ActionCard, CenterLink, MarginCard } from '../pkg'
import { handleFlowError } from '../pkg/errors'

// Import the SDK
import ory from '../pkg/sdk'

type RegistrationProps = {
  flow?: SelfServiceRegistrationFlow
}

// Renders the registration page
const Registration: NextPage<RegistrationProps> = ({flow: initialFlow}) => {
  const router = useRouter()

  // The "flow" represents a registration process and contains
  // information about the form we need to render (e.g. username + password)
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow | undefined>(initialFlow)

  // Get ?flow=... from the URL
  const { flow: flowId, return_to: returnTo } = router.query

  // Set flow query param it's not set or doesn't match current flow
  useEffect(() => {
    if(!flowId && !!initialFlow?.id) {
      router.replace(
        {
          pathname: router.pathname,
          query:  {
            ...router.query,
            flow: initialFlow.id
          },
        },
        undefined,
        {
          shallow: true,
        },
      );
    }
  }, [flowId, initialFlow?.id])

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
            return router.push(flow?.return_to || '/').then(() => {})
          })
          .catch(handleFlowError(router, 'registration', setFlow))
          .catch((err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              setFlow(err.response?.data)
              return
            }

            return Promise.reject(err)
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
        <CenterLink data-testid="cta-link" href="/login">
          Sign in
        </CenterLink>
      </ActionCard>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<RegistrationProps> = async (ctx) => {
  const { req, res, query } = ctx
  const { headers } = req

  const { flow: flowId, return_to: returnTo } = query;

  try {
    if (flowId) {
      const response = await ory.getSelfServiceRegistrationFlow(String(flowId), headers.cookie);
      return { props: { flow: response.data } }
    }
  
    const response = await ory.initializeSelfServiceRegistrationFlowForBrowsers(String(returnTo ?? ''))
    res.setHeader('set-cookie', response.headers['set-cookie'])
    return { props: { flow: response.data } }
  }catch(err) {
    console.log(err);
  }

  return { props: { } };
}

export default Registration
