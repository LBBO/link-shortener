'use client'

import { useIsClient } from '@/app/client-context'
import { getHashAndKeyFromSlug } from '@/app/shortlink-crypto'
import { useQuery } from '@tanstack/react-query'

export const useSlugHashAndKeyFromUrl = () => {
  const isClient = useIsClient()
  return useQuery({
    queryKey: ['key-and-hash', isClient && window.location.hash.slice(1)],
    queryFn: async () => {
      return await getHashAndKeyFromSlug(window.location.hash?.slice(1))
    },
    enabled: Boolean(isClient && window.location.hash),
  })
}
