import axios from "axios"

// calling local next api
export const api = axios.create({
  baseURL: "",
})

// calling hydra oauth2 service
export const hydraApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HYDRA_ADMIN_DOMAIN,
})
