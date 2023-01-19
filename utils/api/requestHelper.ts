import { api, hydraApi } from "."
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios"

import { request_type } from "../../types/enum"

/**
 * Standard GET request
 * @param endpoint - API request endpoint
 */
export const fetchData = async <ResDataType>(
  endpoint: string | null,
): Promise<AxiosResponse<ResDataType> | AxiosError | undefined | any> => {
  if (!endpoint) return

  let response: AxiosResponse<ResDataType>

  console.log("calling api at:", endpoint)
  try {
    response = await api.get(endpoint)

    return response.data
  } catch (err) {
    console.log("Error was caught during GET request:\n", err)
  }
}

/**
 * Standard POST / PUT / PATCH / DELETE request
 * @param endpoint - API request endpoint
 * @param payload - payload object to post to the provided endpoint
 * @param options - additional options to configure the HTTP request
 * @param options.type - type of request, POST, PUT, PATCH, DELETE
 */
export const postData = async <ResDataType>(
  endpoint: string | null,
  payload: { [key: string]: string | any[] | number },
  options?: { type: request_type },
): Promise<AxiosResponse<ResDataType> | AxiosError | undefined | any> => {
  if (!endpoint) return

  let response: AxiosResponse<ResDataType>

  try {
    switch (options?.type) {
      case request_type.POST: {
        response = await api.post(endpoint, payload)
        return response?.data
      }
      case request_type.PUT: {
        response = await api.put(endpoint, payload)
        return response?.data
      }
      case request_type.DELETE: {
        response = await api.delete(endpoint, payload)
        return response?.data
      }
      case request_type.PATCH: {
        response = await api.patch(endpoint, payload)
        return response?.data
      }
      default: {
        response = await hydraApi.post(endpoint, payload)
        return response?.data
      }
    }
  } catch (err) {
    console.log("Error was caught during GET request:\n", err)
  }
}

/**
 * Standard GET request that communicates with the hydra service
 * @param endpoint - API request endpoint
 */
export const fetchHydraData = async <ResDataType>(
  endpoint: string | null,
): Promise<AxiosResponse<ResDataType> | AxiosError | undefined | any> => {
  if (!endpoint) return

  let response: AxiosResponse<ResDataType>

  try {
    response = await hydraApi.get(endpoint)
    return response.data
  } catch (err) {
    console.log("Error was caught during GET request:\n", err)
  }
}

/**
 * Standard POST request that communicates with the hydra service
 * @param endpoint - API request endpoint
 * @param payload - payload object to post to the provided endpoint
 * @param options - additional options to configure the HTTP request
 * @param options.type - type of request, POST, PUT, PATCH, DELETE
 */
export const postHydraData = async <ResDataType>(
  endpoint: string | null,
  payload: { [key: string]: string | any[] | number },
  options?: { type: request_type },
): Promise<AxiosResponse<ResDataType> | AxiosError | undefined | any> => {
  if (!endpoint) return

  let response: AxiosResponse<ResDataType>

  try {
    switch (options?.type) {
      case request_type.POST: {
        response = await hydraApi.post(endpoint, payload)
        return response?.data
      }
      case request_type.PUT: {
        response = await hydraApi.put(endpoint, payload)
        return response?.data
      }
      case request_type.DELETE: {
        response = await hydraApi.delete(endpoint, payload)
        return response?.data
      }
      case request_type.PATCH: {
        response = await hydraApi.patch(endpoint, payload)
        return response?.data
      }
      default: {
        response = await hydraApi.post(endpoint, payload)
        return response?.data
      }
    }
  } catch (err) {
    console.log("Error was caught during GET request:\n", err)
  }
}

// TODO: open and tweak if we need AUTH API HELPERS
// /**
//  * Standard GET request.
//  * @param endpoint - API request endpoint
//  * @param noAuth - (optional) whether request requires auth token
//  * @param axiosInstance - (optional) pass in private axios instance when making request with token authentication
//  */
// export const fetchData = async <ResDataType>(
//   endpoint: string | null,
//   noAuth?: boolean,
//   axiosInstance?: AxiosInstance
// ): Promise<AxiosResponse<ResDataType> | AxiosError | undefined | any> => {
//   let response;

//   console.log('fetching api', endpoint);

//   if (!endpoint) return;

//   console.log('trying');

//   try {
//     if (!noAuth && axiosInstance) {
//       console.log('AUTH!');
//       response = await axiosInstance?.get(endpoint);
//     } else if (noAuth) {
//       console.log('NO AUTH!');
//       response = await api.get(endpoint);
//     }
//   } catch (err: unknown) {
//     if (axios.isAxiosError(err)) {
//       console.error(
//         '[@apiHelper postData] Error caught with POST request:',
//         err
//       );
//       return err;
//     }
//   }

//   return response?.data;
// };

// /**
//  * Standard POST, PATCH, PUT(TODO) request.
//  * @function
//  * @param endpoint - API request endpoint
//  * @param payload - payload object to post to backend
//  * @param noAuth - (optional) whether request requires auth token
//  * @param isPatch - (optional) set true to change Post to Patch function
//  * @param axiosInstance - (optional) pass in private axios instance when making request with token authentication
//  */
// export const postData = async <ResDataType>(
//   endpoint: string | null,
//   payload: any,
//   noAuth?: boolean,
//   isPatch?: boolean,
//   axiosInstance?: AxiosInstance
// ): Promise<AxiosResponse<ResDataType> | AxiosError | undefined | any> => {
//   let response;

//   if (!endpoint) return;

//   // PATCH REQUEST
//   if (isPatch) {
//     try {
//       if (!noAuth && axiosInstance) {
//         response = await axiosInstance?.patch(endpoint, payload);
//       } else if (noAuth && !axiosInstance) {
//         response = await api.patch(endpoint, payload);
//       }

//       console.log('[@apiHelper postData] AFTER request, response:', response);
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         console.error(
//           '[@apiHelper postData] Error caught with PATCH request:',
//           err
//         );
//         return err;
//       }
//     }
//   }
//   // POST REQUEST
//   else {
//     try {
//       if (!noAuth && axiosInstance) {
//         response = await axiosInstance?.post(endpoint, payload);
//       } else if (noAuth && !axiosInstance) {
//         response = await api.post(endpoint, payload);
//       }
//       console.log('[@apiHelper postData] AFTER request, response:', response);
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         console.error(
//           '[@apiHelper postData] Error caught with POST request:',
//           err
//         );
//         return err;
//       }
//     }
//   }

//   return response?.data;
// };
