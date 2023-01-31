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
    response = await api.post("/api/hydra/swapOAuth2Token", {
      code,
      clientID: clientID,
      grantType: grantType,
    })

    hydraAdmin.oAuth2Authorize

    // Using SDK
    // response = await hydraAdmin.oauth2TokenExchange({
    //   code,
    //   grantType: grantType,
    //   // client_id: clientID,
    //   // redirect_uri: "http://127.0.0.1:3000/",
    //   // refresh_token: "false",
    // })
  } catch (err: any) {
    return err.response
  }
  return response
}
