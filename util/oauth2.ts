import { api } from "../axios/api"
import { hydraAdmin } from "../config"

export const getCodeGrantToken = async (
  clientID: string,
  code: string,
  grantType: string,
) => {
  let response
  try {
    // Using API
    // response = await api.post("/api/hydra/swapOAuth2Token", {
    //   code,
    //   client_id: clientID,
    //   grantType: grantType,
    // })

    // Using SDK
    response = hydraAdmin.oauth2TokenExchange({
      grantType: "",
      clientId: "",
      code: "",
      redirectUri: "http:127.0.0.1:3000",
      refreshToken: "",
    })
  } catch (err: any) {
    return err.response.data
  }
  return response
}
