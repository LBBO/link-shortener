'use client'

import { getHashAndKeyFromSlug } from '@/app/shortlink-crypto'
import { useQuery } from '@tanstack/react-query'
import { useSlugFromUrl } from '@/app/redirector/useSlugFromUrl'

export const useSlugHashAndKeyFromUrl = () => {
  const slug = useSlugFromUrl()
  return useQuery({
    queryKey: ['key-and-hash', slug?.slug],
    queryFn: async () => {
      return await getHashAndKeyFromSlug(slug!.slug)
    },
    enabled: Boolean(slug),
    staleTime: 300_000,
    refetchOnWindowFocus: false,
  })
}
