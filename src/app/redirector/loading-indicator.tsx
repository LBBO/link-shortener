import { Loading } from 'react-daisyui'
import { useSlugHashAndKeyFromUrl } from '@/app/redirector/use-slug-hash-and-key-from-url'
import { useTargetUrlBySlugHash } from '@/app/redirector/useTargetUrlBySlugHash'

export const LoadingIndicator = () => {
  const slugHashAndKeyFromUrl = useSlugHashAndKeyFromUrl()
  const targetUrlBySlugHash = useTargetUrlBySlugHash(
    slugHashAndKeyFromUrl?.data,
  )
  return (
    <div>
      <Loading />
      {slugHashAndKeyFromUrl.isLoading && 'Encrypting your data'}
      {targetUrlBySlugHash.isLoading && 'Fetching and decrypting shortlink'}
    </div>
  )
}
