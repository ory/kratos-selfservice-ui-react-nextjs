# Example Integration for Ory with NextJS (ReactJS + TypeScript)

This repository contains a NextJS (ReactJS) application with

- [a page which shows if the user is logged in or not]()
- [bring your own UI pages for]()
  - login
  - registration
  - account settings
  - email / phone verification
  - account recovery

All pages work with Ory Cloud's SDKs and APIs as well as with open source Ory Kratos!

## Ory Cloud

Get started by [signing up for an Ory Cloud account](https://console.ory.sh/registration) and creating your first [Ory Cloud Project](https://www.ory.sh/docs/start-building/create-project). Then,
get the Project's [SDK Configuration](https://www.ory.sh/docs/concepts/services-api/#sdk-configuration) and
set it in your environment:

```
export ORY_SDK_URL=https://...
```

## Open Source Ory Kratos

If you are using Open Source Ory Kratos ([read the quickstart](https://www.ory.sh/kratos/docs/quickstart)),
set the `ORY_KRATOS_PUBLIC_URL` to Ory Kratos' Public URL:

```
export ORY_KRATOS_PUBLIC_URL=http://...
```

In the case of the Quickstart this would be:

```
export ORY_KRATOS_PUBLIC_URL=http://localhost:4455
```

## Start From Scratch

To start from scratch, initialize the NextJS App:

```
npx create-next-app
```

```
npm i --save @ory/cli
```

## 


---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
