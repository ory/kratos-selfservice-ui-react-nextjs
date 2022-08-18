import { AxiosError } from 'axios'
import Image from 'next/image'
import { NextRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react'

import showNotification, { NotificationType } from './ui/Toastify'

// A small function to help us deal with errors coming from fetching a flow.
export function handleGetFlowError<S>(
  router: NextRouter,
  flowType: 'login' | 'registration' | 'settings' | 'recovery' | 'verification',
  resetFlow: Dispatch<SetStateAction<S | undefined>>
) {
  return async (err: AxiosError) => {
    switch (err.response?.data.error?.id) {
      case 'session_aal2_required':
        // 2FA is enabled and enforced, but user did not perform 2fa yet!
        window.location.href = err.response?.data.redirect_browser_to
        return
      case 'session_already_available':
        // User is already signed in, let's redirect them home!
        await router.push('/')
        return
      case 'session_refresh_required':
        // We need to re-authenticate to perform this action
        window.location.href = err.response?.data.redirect_browser_to
        return
      case 'self_service_flow_return_to_forbidden':
        // The flow expired, let's request a new one.
        showNotification({
          content: 'The return_to address is not allowed',
          type: NotificationType.ERROR
        })
        resetFlow(undefined)
        await router.push('/' + flowType)
        return
      case 'self_service_flow_expired':
        // The flow expired, let's request a new one.
        showNotification({
          content: 'Your interaction expired, please fill out the form again',
          type: NotificationType.ERROR
        })
        resetFlow(undefined)
        await router.push('/' + flowType)
        return
      case 'security_csrf_violation':
        // A CSRF violation occurred. Best to just refresh the flow!
        showNotification({
          content:
            'A security violation was detected, please fill out the form again',
          type: NotificationType.ERROR
        })
        resetFlow(undefined)
        await router.push('/' + flowType)
        return
      case 'security_identity_mismatch':
        // The requested item was intended for someone else. Let's request a new flow...
        resetFlow(undefined)
        await router.push('/' + flowType)
        return
      case 'browser_location_change_required':
        // Ory Kratos asked us to point the user to this URL.
        window.location.href = err.response.data.redirect_browser_to
        return
    }

    switch (err.response?.status) {
      case 410:
        // The flow expired, let's request a new one.
        resetFlow(undefined)
        await router.push('/' + flowType)
        return
    }

    // We are not able to handle the error? Return it.
    return Promise.reject(err)
  }
}

// A small function to help us deal with errors coming from initializing a flow.
export const handleFlowError = handleGetFlowError
