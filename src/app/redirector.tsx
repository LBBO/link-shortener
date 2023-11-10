'use client'

import { useQuery } from '@tanstack/react-query'
import { shortlinkLookupResponseSchema } from '@/app/shortlink.schema'
import { useEffect } from 'react'
import { useIsClient } from '@/app/client-context'
import { encryptUrl, getHashAndKeyFromSlug } from '@/app/shortlink-crypto'

export const Redirector = () => {
  const isClient = useIsClient()
  const shortlink = useQuery({
    queryKey: ['shortlink', isClient && window?.location?.hash],
    queryFn: async () => {
      const { hash, key } = await getHashAndKeyFromSlug(
        window?.location?.hash?.slice(1),
      )
      const res = await fetch(`api/shortlink/${hash}`)
      await encryptUrl(key, 'https://google.com')
      return await res.json()
    },
    enabled: Boolean(isClient && window?.location?.hash),
    select: (data) => shortlinkLookupResponseSchema.parse(data),
  })

  useEffect(() => {
    if (shortlink.data?.encryptedUrl) {
      console.log(shortlink.data.encryptedUrl)
      // redirect(shortlink.data.link)
    }
  }, [shortlink.data?.encryptedUrl])

  return <div>{JSON.stringify(shortlink, null, 2)}</div>
}
