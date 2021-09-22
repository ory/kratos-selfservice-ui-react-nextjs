import { Configuration, V0alpha2Api } from '@ory/kratos-client'

export const ory = new V0alpha2Api(
  new Configuration({
    basePath: process.env.NEXT_PUBLIC_ORY_KRATOS_PUBLIC,
    baseOptions: {
      // Ensure we send credentials over CORS
      withCredentials: true
    }
  })
)

// If you want to access Ory Kratos' Admin API, you will need to configure an additional
// SDK that points to the admin URL:
//
// export const oryAdmin = new V0alpha2Api(
//     new Configuration({
//         basePath: 'http://kratos-admin.example.org/',
//         baseOptions: {
//             // Ensure we send credentials over CORS
//             withCredentials: true
//         }
//     })
// )
