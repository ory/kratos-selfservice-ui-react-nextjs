import { ReactNode, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { SelfServiceSettingsFlow } from '@ory/client'
import { Card, CardTitle, H3, P } from '@ory/themes'
import { Flow } from '../pkg/ui/Flow'
import { AxiosError } from 'axios'
import { ActionCard, CenterLink } from '../pkg/styled'
import Link from 'next/link'
import Head from 'next/head'
import { Props as FlowProps } from '../pkg/ui/Flow'

// Or if you use the open source:
//
// import {ory} from "../../pkg/open-source";
import { ory } from '../pkg/cloud'

const SettingsCard = ({
  flow,
  only,
  children
}: FlowProps & { children: ReactNode }) => {
  if (!flow) {
    return null
  }

  const nodes = only
    ? flow.ui.nodes.filter(({ group }) => group === only)
    : flow.ui.nodes

  if (nodes.length === 0) {
    return null
  }

  return <ActionCard wide>{children}</ActionCard>
}

const Settings: NextPage = () => {
  const [flow, setFlow] = useState<SelfServiceSettingsFlow>()

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
        .getSelfServiceSettingsFlow(String(flowId))
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 410:
            // Status code 410 means the request has expired - so let's load a fresh flow!
            case 403:
              // Status code 403 implies some other issue (e.g. CSRF) - let's reload!
              return router.push('/settings')
          }

          throw err
        })
      return
    }

    // Otherwise we initialize it
    ory.initializeSelfServiceSettingsFlowForBrowsers().then(({ data }) => {
      setFlow(data)
    })
  }, [flowId, router.isReady])

  return (
    <>
      <Head>
        <title>
          Profile Management and Security Settings - Ory NextJS Integration
          Example
        </title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <CardTitle style={{ marginTop: 80 }}>
        Profile Management and Security Settings
      </CardTitle>
      <SettingsCard only="profile" flow={flow}>
        <H3>Profile Settings</H3>
        <Flow only="profile" flow={flow} />
      </SettingsCard>
      <SettingsCard only="password" flow={flow}>
        <H3>Change Password</H3>
        <Flow only="password" flow={flow} />
      </SettingsCard>
      <SettingsCard only="oidc" flow={flow}>
        <H3>Manage Social Sign In</H3>
        <Flow only="oidc" flow={flow} />
      </SettingsCard>
      <SettingsCard only="lookup_secret" flow={flow}>
        <H3>Manage 2FA Backup Recovery Codes</H3>
        <P>
          Recovery codes can be used in panic situations where you have lost
          access to your 2FA device.
        </P>
        <Flow only="lookup_secret" flow={flow} />
      </SettingsCard>
      <SettingsCard only="totp" flow={flow}>
        <H3>Manage 2FA TOTP Authenticator App</H3>
        <P>
          Add a TOTP Authenticator App to your account to improve your account
          security. Popular Authenticator Apps are{' '}
          <a href="https://www.lastpass.com" target="_blank">
            LastPass
          </a>{' '}
          and Google Authenticator (
          <a
            href="https://apps.apple.com/us/app/google-authenticator/id388497605"
            target="_blank"
          >
            iOS
          </a>
          ,{' '}
          <a
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
            target="_blank"
          >
            Android
          </a>
          ).
        </P>
        <Flow only="totp" flow={flow} />
      </SettingsCard>
      <SettingsCard only="webauthn" flow={flow}>
        <H3>Manage Hardware Tokens and Biometrics</H3>
        <P>
          Use Hardware Tokens (e.g. YubiKey) or Biometrics (e.g. FaceID,
          TouchID) to enhance your account security.
        </P>
        <Flow only="webauthn" flow={flow} />
      </SettingsCard>
      <ActionCard wide>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}

export default Settings
