// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Configuration, OAuth2Api } from "@ory/hydra-client"

const baseOptions: any = {
  withCredentials: true, // Important for CORS
  timeout: 30000, // 30 seconds
}

if (process.env.MOCK_TLS_TERMINATION) {
  baseOptions.headers = { "X-Forwarded-Proto": "https" }
}

const configuration = new Configuration({
  basePath: process.env.HYDRA_ADMIN_URL,
  accessToken: process.env.ORY_API_KEY || process.env.ORY_PAT,
  baseOptions,
})

const hydraAdmin = new OAuth2Api(configuration)

export { hydraAdmin }
