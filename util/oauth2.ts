import { api } from "../axios/api"

export const getCodeGrantToken = async (
  clientID: string,
  code: string,
  grantType: string,
) => {
  let response
  try {
    response = await api.post("/api/hydra/swapOAuth2Token", {
      code,
      client_id: clientID,
      grantType: grantType,
    })
    return response
  } catch (err: any) {
    return err.response.data
  }
}
