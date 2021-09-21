import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { SelfServiceError } from '@ory/client'
import { CardTitle, CodeBox } from '@ory/themes'
import { AxiosError } from 'axios'
import { ActionCard, CenterLink, MarginCard } from '../pkg/styled'
import Link from 'next/link'
import ory from '../pkg/sdk'

const Login: NextPage = () => {
  const [error, setError] = useState<SelfServiceError | string>()

  // Get ?id=... from the URL
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    ory
      .getSelfServiceError(String(id))
      .then(({ data }) => {
        setError(data)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 404:
          case 403:
          case 410:
            return router.push('/')
        }

        return Promise.reject(err)
      })
  }, [id, router, router.isReady])

  if (!error) {
    return null
  }

  return (
    <>
      <MarginCard wide>
        <CardTitle>An error occurred</CardTitle>
        <CodeBox code={JSON.stringify(error, null, 2)} />
      </MarginCard>
      <ActionCard wide>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}

export default Login
