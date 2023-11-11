import { useQuery } from '@tanstack/react-query'
import { encryptedUrlDataSchema } from '@/app/shortlink.schema'

export const useEncryptedUrlData = (slugHash?: string) =>
  useQuery({
    queryKey: ['shortlink', slugHash],
    enabled: Boolean(slugHash),
    queryFn: async () => {
      if (slugHash) {
        const res = await fetch(`api/shortlink/${encodeURIComponent(slugHash)}`)

        if (!res.ok) {
          throw new Error('That shortlink could not be found')
        }

        return encryptedUrlDataSchema.parse(await res.json())
      }
    },
  })
