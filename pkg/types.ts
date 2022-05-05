import {
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SelfServiceVerificationFlow
} from '@ory/client'

/**
 * Ory flow response
 */
export type OrySelfServiceFlow =
  | SelfServiceLoginFlow
  | SelfServiceRecoveryFlow
  | SelfServiceRegistrationFlow
  | SelfServiceSettingsFlow
  | SelfServiceVerificationFlow

/**
 * Ory flow type
 */
export type OryFlowType =
  | 'login'
  | 'registration'
  | 'settings'
  | 'recovery'
  | 'verification'

/**
 * Ory page query
 */
export type OryPageQuery = {
  // URL to return to after logging in
  return_to?: string
  // Existing flow ID
  flow?: string
  // Session refresh request
  // Example use: when we want to update the password
  refresh?: string
  // AAL = Authorization Assurance Level (two-factor auth)
  // This implies that we want to upgrade the AAL
  aal?: string
}
