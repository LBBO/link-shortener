'use client'

import { LoadingIndicator } from '@/app/redirector/loading-indicator'
import { useSlugHashAndKeyFromUrl } from '@/app/redirector/use-slug-hash-and-key-from-url'
import { useTargetUrlBySlugHash } from '@/app/redirector/useTargetUrlBySlugHash'

export const Redirector = () => {
  const slugHashAndKeyFromUrl = useSlugHashAndKeyFromUrl()
  const targetUrlBySlugHash = useTargetUrlBySlugHash(
    slugHashAndKeyFromUrl?.data,
  )
  return (
    <div>
      <LoadingIndicator />
    </div>
  )
}
