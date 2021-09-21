# Example Integration for Ory with NextJS (ReactJS + TypeScript)

This is an example using ReactJS to build an app with

- [a page which shows if the user is logged in or not](pages/index.tsx)
- [a page](pages/protected.tsx) using an [API endpoint](pages/api/protected.ts)
  which is protected
- [login](pages/login.tsx)
- [registration](pages/ui/registration.tsx)
- [account settings](pages/ui/settings.tsx)
- [account verification](pages/ui/verification.tsx) (e.g. email, phone, activate
  account)
- [account verification](pages/ui/recovery.tsx) (e.g. reset password)

To avoid the complexity of setting up routing and state management and in the
hopes of making this example easy to consume, we have chosen NextJS as the
framework.

All pages work with Ory Cloud's SDKs and APIs as well as with open source Ory
Kratos!

## Run ReactJS + TypeScript + NextJS + Ory

Before we head deep into the details, let's see the demo live! First, clone this
repository and then choose whether you want to use Ory Cloud or Open Source Ory
Kratos!

### Ory Cloud

Get started by
[signing up for an Ory Cloud account](https://console.ory.sh/registration) and
creating your first
[Ory Cloud Project](https://www.ory.sh/docs/start-building/create-project). Then
get the Project's
[SDK Configuration](https://www.ory.sh/docs/concepts/services-api/#sdk-configuration)
and set it in your environment and start the process:

```
npm i
export ORY_SDK_URL=...
npm run dev
```

Next head over to [http://localhost:3000/](http://localhost:3000/) to see the
app in action with login, registration - a working user management!

#### Additional Configuration

To get everything to work smoothly, we recommend setting the appropriate UI
endpoints in your Ory Cloud Project under the "User Interface" menu item:

- Login UI: `http://localhost:3000/login`
- Registration UI: `http://localhost:3000/registration`
- Settings UI: `http://localhost:3000/settings`
- Verification UI: `http://localhost:3000/verification`
- Recovery UI: `http://localhost:3000/recovery`
- Error UI: `http://localhost:3000/error`

![Ory Cloud Project User Interface Configuration](./docs/images/ui-settings.png)

Also, ensure to set up your redirects correctly, so you end up at the right
endpoint after you have signed up or signed in!

![Ory Cloud Project User Interface Configuration](./docs/images/redirects.png)

We are setting these values to ensure that all flows (e.g. clicking on that
password reset link) end up at your application. If you deploy to production,
set these values to your production URL!

### Open Source Ory Kratos

Of course, this application also integrates with Open Source Ory Kratos! Instead
of setting up the `ORY_SDK_URL` you will need to set the environment variable
`NEXT_PUBLIC_ORY_KRATOS_PUBLIC` to your Ory Kratos public API!

If you are running the
[Ory Kratos Quickstart](https://www.ory.sh/kratos/docs/quickstart) this is:

```
NEXT_PUBLIC_ORY_KRATOS_PUBLIC=http://localhost:4433
```

#### CORS

Please be aware that you need to add the port where your NextJS is running to
the list of allowed CORS origins. You also need to allow some headers.

If you are running

```yaml
serve:
  public:
    cors:
      allowed_origins:
        - http://localhost:3000
```

## Start From Scratch

To start from scratch, initialize the NextJS App

```
npx create-next-app --ts
```

### Installing Ory

To make things easy, also the Ory Cloud SDK and the Ory Cloud Integration
package. The Ory Cloud SDK is used to interact with Ory Cloud's APIs. The Ory
Cloud Integration package contains code to easily connect apps to Ory's APIs and
make cookies and other features work out of the box:

```
npm i --save @ory/client @ory/integrations
```

#### Installing Open Source Ory Kratos

If you use Open Source Ory Kratos you only need to install `@ory/kratos-client`
to interface with Ory Kratos' APIs. Please be aware that Ory Kratos and your
NextJS app must run on the same domain name! Be aware that `127.0.0.1` and
`localhost` are different domain names!

```
npm i --save @ory/kratos-client
```

## Deploy on Vercel with Ory Cloud

This section only works in combination with Ory Cloud. If you run Open Source
Ory Kratos, ensure that your NextJS app and Ory Kratos run on the same top-level
domain (e.g. `example.org`) and configure Ory Kratos with the correct cookie
settings. The easiest way to deploy your Next.js + Ory Cloud app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

If you have never deployed on Vercel, check out the
[Next.js deployment documentation](https://nextjs.org/docs/deployment) for more
details.

Deploying the app is easy. Ensure that your build works by running

```
npm run build
```

Then, set up your [Vercel](https://vercel.com/) account and create a new app.
You will need to configure your
[Ory Cloud Project SDK URL](https://www.ory.sh/docs/concepts/services-api) as an
environment variable for your app:

![TODO]()

Next all you need to do is to run the deploy command:

```
npx vercel deploy --prod
```
