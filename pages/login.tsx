import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { CardTitle } from "@ory/themes"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { ActionCard, CenterLink, LogoutLink, Flow, MarginCard } from "../pkg"
import { handleGetFlowError, handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"

const Login: NextPage = () => {
  const [flow, setFlow] = useState<LoginFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const {
    return_to: returnTo,
    flow: flowId,
    // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
    // of a user.
    refresh,
    // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
    // to perform two-factor authentication/verification.
    aal,
    via,
  } = router.query

  // This might be confusing, but we want to show the user an option
  // to sign out if they are performing two-factor authentication!
  const onLogout = LogoutLink([aal, refresh])

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getLoginFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleGetFlowError(router, "login", setFlow))
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserLoginFlow({
        refresh: Boolean(refresh),
        aal: aal ? String(aal) : undefined,
        returnTo: returnTo ? String(returnTo) : undefined,
        via: via ? String(via) : undefined,
      } as any)
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "login", setFlow))
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow, via])

  const onSubmit = (values: UpdateLoginFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/login?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateLoginFlow({
            flow: String(flow?.id),
            updateLoginFlowBody: values,
          })
          // We logged in successfully! Let's bring the user home.
          .then(() => {
            if (flow?.return_to) {
              window.location.href = flow?.return_to
              return
            }
            router.push("/")
          })
          .then(() => {})
          .catch(handleFlowError(router, "login", setFlow))
          .catch((err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              setFlow(err.response?.data)
              return
            }

            return Promise.reject(err)
          }),
      )

  return (
    <>
      <Head>
        <title>Sign in - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <MarginCard>
        <CardTitle>
          {(() => {
            if (flow?.refresh) {
              return "Confirm Action"
            } else if (flow?.requested_aal === "aal2") {
              return "Two-Factor Authentication"
            }
            return "Sign In"
          })()}
        </CardTitle>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      {aal || refresh ? (
        <ActionCard>
          <CenterLink data-testid="logout-link" onClick={onLogout}>
            Log out
          </CenterLink>
        </ActionCard>
      ) : (
        <>
          <ActionCard>
            <Link href="/registration" passHref>
              <CenterLink>Create account</CenterLink>
            </Link>
          </ActionCard>
          <ActionCard>
            <Link href="/recovery" passHref>
              <CenterLink>Recover your account</CenterLink>
            </Link>
          </ActionCard>
        </>
      )}
    </>
  )
}

export default Login
