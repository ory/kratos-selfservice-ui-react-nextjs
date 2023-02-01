import { AxiosError } from "axios"
import { NextRouter } from "next/router"
import { Dispatch, SetStateAction } from "react"
import { toast } from "react-toastify"

// A small function to help us deal with errors coming from fetching a flow.
export function handleGetFlowError<S>(
  router: NextRouter,
  flowType: "login" | "registration" | "settings" | "recovery" | "verification",
  resetFlow: Dispatch<SetStateAction<S | undefined>>,
) {
  console.log("error handler init")
  return async (err: AxiosError) => {
    console.log("error handler within", err.response?.data)
    switch (err.response?.data.error?.id) {
      case "session_aal2_required":
        console.log("reached 1")
        // 2FA is enabled and enforced, but user did not perform 2fa yet!
        window.location.href = err.response?.data.redirect_browser_to
        return
      case "session_already_available":
        console.log("reached 2")
        // User is already signed in, let's redirect them home!
        await router.push("/")
        return
      case "session_refresh_required":
        console.log("reached 3")
        // We need to re-authenticate to perform this action
        window.location.href = err.response?.data.redirect_browser_to
        return
      case "self_service_flow_return_to_forbidden":
        console.log("reached 4")
        // The flow expired, let's request a new one.
        toast.error("The return_to address is not allowed.")
        resetFlow(undefined)
        await router.push("/" + flowType)
        return
      case "self_service_flow_expired":
        console.log("reached 5")
        // The flow expired, let's request a new one.
        toast.error("Your interaction expired, please fill out the form again.")
        resetFlow(undefined)
        await router.push("/" + flowType)
        return
      case "security_csrf_violation":
        console.log("reached 6")
        // A CSRF violation occurred. Best to just refresh the flow!
        toast.error(
          "A security violation was detected, please fill out the form again.",
        )
        resetFlow(undefined)
        await router.push("/" + flowType)
        return
      case "security_identity_mismatch":
        console.log("reached 7")
        // The requested item was intended for someone else. Let's request a new flow...
        resetFlow(undefined)
        await router.push("/" + flowType)
        return
      case "browser_location_change_required":
        console.log("reached 8")
        // Ory Kratos asked us to point the user to this URL.
        window.location.href = err.response.data.redirect_browser_to
        return
    }

    console.log("reached the end")

    // original Kratos handling flow expiry
    // switch (err.response?.status) {
    //   case 410:
    //     // The flow expired, let's request a new one.
    //     resetFlow(undefined)
    //     await router.push("/" + flowType)
    //     return
    // }

    // We are not able to handle the error? Return it.
    return Promise.reject(err)
  }
}

// A small function to help us deal with errors coming from initializing a flow.
export const handleFlowError = handleGetFlowError
