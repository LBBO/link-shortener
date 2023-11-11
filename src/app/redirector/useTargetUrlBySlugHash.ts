import { useQuery } from '@tanstack/react-query'
import { verifyAndDecrypt } from '@/app/shortlink-crypto'
import { encryptedUrlDataSchema } from '@/app/shortlink.schema'

export const useTargetUrlBySlugHash = (hashAndKey?: {
  hash: string
  key: Buffer
}) =>
  useQuery({
    queryKey: ['shortlink', hashAndKey?.hash],
    enabled: Boolean(hashAndKey),
    queryFn: async () => {
      if (hashAndKey) {
        const { hash, key } = hashAndKey
        const res = await fetch(`api/shortlink/${hash}`)
        return await verifyAndDecrypt(
          key,
          encryptedUrlDataSchema.parse(await res.json()),
        )
      }
    },
  })
