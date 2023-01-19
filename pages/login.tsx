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
import { request_type } from "../types/enum"
import { fetchHydraData, fetchData, postData } from "../utils/api/requestHelper"

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
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "login", setFlow))
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow])

  const onSubmit = async (values: UpdateLoginFlowBody) => {
    console.log("[@OAuth2.0 flow] values:", values)

    try {
      // const routerAction = await router.push(
      //   `/login?flow=${flow?.id}`,
      //   undefined,
      //   { shallow: true },
      // )
      const routerAction = "test"
      if (routerAction) {
        try {
          // performs authentication via Ory Kratos
          const oryLoginFlow = await ory.updateLoginFlow({
            flow: String(flow?.id),
            updateLoginFlowBody: values,
          })
          if (flow?.return_to) {
            window.location.href = flow?.return_to
            return
          }

          console.log("[@OAuth2.0 flow] oryLoginFlow", oryLoginFlow)

          // fetch extra data about the login challenge
          const oauth2LoginData = await fetchData(`/api/hydra/oauth2/getLogin`)
          console.log("[@OAuth2.0 flow] oauth2LoginData:", oauth2LoginData)
          // post to hydra accept the login challenge after authenticating
          const acceptLoginChallenge = await postData(
            `/api/hydra/oauth2/acceptLogin`,
            { subject: "test" },
            { type: request_type.POST },
          )
          console.log(
            "[@OAuth2.0 flow] acceptLoginChallenge:",
            acceptLoginChallenge,
          )

          // redirect to next flow

          router.push(acceptLoginChallenge?.data?.redirect_to)
        } catch (err: AxiosError) {
          if (err.response?.status === 400) {
            console.log(
              "error caught while attemping login flow:",
              err.response,
            )
            setFlow(err.response?.data)
            return
          }

          return Promise.reject(err)
        }
      }
    } catch (err) {
      handleFlowError(router, "login", setFlow)
    }
  }
  return (
    <>
      <Head>
        <title>Sign in - Ory NextJS Integration Example - Cooler Master</title>
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
