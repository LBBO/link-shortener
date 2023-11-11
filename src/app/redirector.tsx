'use client'

import { useSlugHashAndKeyFromUrl } from '@/app/redirector/use-slug-hash-and-key-from-url'
import { useDecryptedUrl } from '@/app/redirector/useTargetUrlBySlugHash'
import { useSlugFromUrl } from '@/app/redirector/useSlugFromUrl'
import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { useOrigin } from '@/app/redirector/useOrigin'
import { UseQueryResult } from '@tanstack/react-query'
import { Loading } from 'react-daisyui'
import { useEncryptedUrlData } from '@/app/redirector/useEncryptedUrlData'

const SpinnerOrCheck = ({ query }: { query: UseQueryResult }) => {
  if (query.isLoading) {
    return <Loading />
  }

  if (query.isSuccess) {
    return '✅'
  }

  if (query.isError) {
    console.log(query.error)
    return '⛔️'
  }

  return '🫥'
}

export const Redirector = () => {
  const slugHashAndKeyFromUrl = useSlugHashAndKeyFromUrl()
  const encryptedUrlData = useEncryptedUrlData(slugHashAndKeyFromUrl.data?.hash)
  const decryptedUrl = useDecryptedUrl(
    slugHashAndKeyFromUrl.data?.key,
    encryptedUrlData.data,
  )

  const slugData = useSlugFromUrl()
  const shouldRedirectImmediately = slugData?.shouldRedirectImmediately ?? false

  useEffect(() => {
    if (shouldRedirectImmediately && decryptedUrl.data) {
      redirect(decryptedUrl.data)
    }
  }, [shouldRedirectImmediately, decryptedUrl.data])

  const origin = useOrigin()

  return (
    slugData && (
      <div>
        <ul>
          <li className="flex gap-4">
            <SpinnerOrCheck query={slugHashAndKeyFromUrl} />
            <span>Encrypting your request</span>
          </li>
          <li className="flex gap-4">
            <SpinnerOrCheck query={encryptedUrlData} />
            <span>Fetching encrypted URL</span>
          </li>
          <li className="flex gap-4">
            <SpinnerOrCheck query={decryptedUrl} />
            <span>Decrypting URL</span>
          </li>
        </ul>

        {!encryptedUrlData.isError ? (
          <div>
            <h2>Here{"'"}s your link!</h2>
            <p>
              {origin}/#{slugData?.slug} -&gt;{' '}
              {decryptedUrl.data ? (
                <a href={decryptedUrl.data}>{decryptedUrl.data}</a>
              ) : (
                '...'
              )}{' '}
            </p>
          </div>
        ) : (
          <h2 className="text-error text-2xl">
            Uh-oh, looks like{' '}
            <a className="kbd">
              {origin}/#{slugData?.slug}
            </a>{' '}
            doesn{"'"}t exist!
          </h2>
        )}
      </div>
    )
  )
}
