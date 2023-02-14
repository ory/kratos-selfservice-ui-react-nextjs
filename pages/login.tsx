import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { CardTitle } from "@ory/themes"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { api } from "../axios/api"
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
  } = router.query

  // This might be confusing, but we want to show the user an option
  // to sign out if they are performing two-factor authentication!
  const onLogout = LogoutLink([aal, refresh])

  const hydraLoginService = async () => {
    const login_challenge = router.query.login_challenge
    const response = await fetch(
      "/api/hydra/login?login_challenge=" + login_challenge,
      {
        method: "GET",
      },
    )
    return response
  }

  useEffect(() => {
    hydraLoginService()
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getLoginFlow({ id: String(flowId) })
        .then(({ data }) => {
          console.log(data)
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
        if (router.query.login_challenge) {
          data.oauth2_login_challenge = router.query.login_challenge as string
        }
        console.log(data)
        setFlow(data)
      })
      .catch(handleFlowError(router, "login", setFlow))
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow])

  const doConsentProcess = async (login_challenge: string, subject: string) => {
    console.log(
      "[@login_challenge-doConsentProcess] login_challenge",
      login_challenge,
    )
    console.log(subject)

    // new OAuth2.0 flow with hydra
    const response = await api
      .post("/api/hydra/login", {
        login_challenge,
        subject,
      })
      .then((res) => {
        console.log("[@] POST hydra/login response", response)
        // login response was successful re-route to consent-page
        if (res.status === 200) {
          // redirect with challenge:
          router.push(res.data?.redirect_to)
        }
      })
      .catch((err: AxiosError) => {
        console.log("[@post-api-hydra] POST hydra/login error", err)
      })
  }

  // const onSubmit = async (values: UpdateLoginFlowBody) => {
  const onSubmit = async (values: any) => {
    const login_challenge = router.query.login_challenge

    // TODO - this is temp method to add subject, need to get subject from account
    let subject = ""
    if (values?.identifier) {
      console.log("values", values.identifier)
      subject = values.identifier
    }
    return (
      // original Kratos flow - not needed anymore since we don't need use router to push to the url with flow id
      // router
      //   // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      //   // his data when she/he reloads the page.
      //   // .push(`/login?flow=${flow?.id}`, undefined, { shallow: true })
      //   .push("/login")
      //   .then(() =>

      ory
        .updateLoginFlow({
          flow: String(flow?.id),
          updateLoginFlowBody: values,
        })

        // We logged in successfully! Let's bring the user home.
        .then((data) => {
          // new flow
          if (login_challenge) {
            doConsentProcess(login_challenge as string, subject)
          } else {
            // Original Kratos flow
            // console.log("data", data)
            // console.log("flow", flow)
            if (flow?.return_to) {
              window.location.href = flow?.return_to
              return
            }
            router.push("/")
          }
        })
        .then(() => {})
        .catch(handleFlowError(router, "login", setFlow))
        .catch((err: any) => {
          // If the previous handler did not catch the error it's most likely a form validation error
          console.log("handleFlowError errored with:", err)
          if (err.response?.status === 400) {
            // Yup, it is!
            if (err && err.response) {
              setFlow(err.response?.data)
            }
            return
          }
          return Promise.reject(err)
        })
    )
  }

  return (
    <>
      {/* CUSTOMIZE UI BASED ON CLIENT ID */}
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
            return "Sign In (ID can be Email or Username)"
          })()}
        </CardTitle>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="https://res.cloudinary.com/dfkw9hdq3/image/upload/v1675237431/CI-Temp/CMID_ubofj6.png"
            width={150}
          />
        </div>

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
