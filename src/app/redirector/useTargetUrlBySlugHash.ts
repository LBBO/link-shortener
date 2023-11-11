import { useQuery } from '@tanstack/react-query'
import { verifyAndDecrypt } from '@/app/shortlink-crypto'
import { EncryptedUrlData, validUrlSchema } from '@/app/shortlink.schema'

export const useDecryptedUrl = (
  key?: Buffer,
  encryptedUrlData?: EncryptedUrlData,
) =>
  useQuery({
    queryKey: ['decrypt-url', encryptedUrlData?.ciphertext],
    enabled: Boolean(key && encryptedUrlData),
    queryFn: async () => {
      if (key && encryptedUrlData) {
        const cleartext = await verifyAndDecrypt(key, encryptedUrlData)

        //   Ensure that nobody created some ill-formed URL
        return validUrlSchema.parse(cleartext)
      }
    },
    staleTime: 300_000,
  })
