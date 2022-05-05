import { AxiosError } from 'axios'
import { NextRouter, useRouter } from 'next/router'
import {
  useState,
  useEffect,
  DependencyList,
  Dispatch,
  SetStateAction
} from 'react'

import { handleGetFlowError } from './errors'
import ory from './sdk'
import { OrySelfServiceFlow, OryFlowType, OryPageQuery } from './types'

// Returns a function which will log the user out
export function createLogoutHandler(deps?: DependencyList) {
  const [logoutToken, setLogoutToken] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    ory
      .createSelfServiceLogoutFlowUrlForBrowsers()
      .then(({ data }) => {
        setLogoutToken(data.logout_token)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            // do nothing, the user is not logged in
            return
        }

        // Something else happened!
        return Promise.reject(err)
      })
  }, deps)

  return () => {
    if (logoutToken) {
      ory
        .submitSelfServiceLogoutFlow(logoutToken)
        .then(() => router.push('/login'))
        .then(() => router.reload())
    }
  }
}

/**
 * Get self-service flow
 */
export const OryGetSelfServiceFlow = (
  flowType: OryFlowType,
  query: OryPageQuery
) => {
  switch (flowType) {
    case 'login':
      return ory.getSelfServiceLoginFlow(`${query.flow || ''}`)
      break
    case 'recovery':
      return ory.getSelfServiceRecoveryFlow(`${query.flow || ''}`)
      break
    case 'registration':
      return ory.getSelfServiceRegistrationFlow(`${query.flow || ''}`)
      break
    case 'settings':
      return ory.getSelfServiceSettingsFlow(`${query.flow || ''}`)
      break
    case 'verification':
      return ory.getSelfServiceVerificationFlow(`${query.flow || ''}`)
      break
    default:
      return Promise.reject(`Unsupported flow type ${flowType}`)
      break
  }
}

/**
 * Get self-service flow
 */
export const OryInitializeSelfServiceFlow = (
  flowType: OryFlowType,
  query: OryPageQuery
) => {
  switch (flowType) {
    case 'login':
      return ory.initializeSelfServiceLoginFlowForBrowsers(
        Boolean(query.refresh),
        query.aal,
        query.return_to
      )
      break
    case 'recovery':
      return ory.initializeSelfServiceRecoveryFlowForBrowsers(query.return_to)
      break
    case 'registration':
      return ory.initializeSelfServiceRegistrationFlowForBrowsers(
        query.return_to
      )
      break
    case 'settings':
      return ory.initializeSelfServiceSettingsFlowForBrowsers(query.return_to)
      break
    case 'verification':
      return ory.initializeSelfServiceVerificationFlowForBrowsers(
        query.return_to
      )
      break
    default:
      return Promise.reject(`Unsupported flow type ${flowType}`)
      break
  }
}

/**
 * Initialize a flow
 */
export const OryGetOrInitializeFlow = <S extends OrySelfServiceFlow>(
  flowType: OryFlowType,
  router: NextRouter,
  resetFlow: Dispatch<SetStateAction<S | undefined>>
): Promise<S> => {
  const query = router.query as OryPageQuery

  return (
    query.flow
      ? OryGetSelfServiceFlow(flowType, query)
      : OryInitializeSelfServiceFlow(flowType, query)
  )
    .catch(handleGetFlowError(router, flowType, resetFlow))
    .then((data) => {
      if (!data) {
        return Promise.reject()
      }

      return data.data as S
    })
}
