import { encryptedUrlDataSchema } from '@/app/shortlink.schema'
import { getDbClient } from '@/app/api/db-connection'
import { notFound } from 'next/navigation'

export const GET = async (
  _req: Request,
  { params: { slugHash } }: { params: { slugHash: string } },
) => {
  const dbClient = await getDbClient()
  const res = await dbClient.query(
    `
            SELECT url_iv, url_ciphertext, url_hmac
            FROM shortlinks
            WHERE slug_hash = $1`,
    [slugHash],
  )

  if (!res.rowCount || res.rowCount < 1) {
    notFound()
  }

  if (res.rowCount > 1) {
    console.error(res.rows)
    throw new Error(
      'Found more than one results for hash. This should not be possible.',
    )
  }

  const row = res.rows[0]

  const result = encryptedUrlDataSchema.parse({
    iv: row.url_iv,
    ciphertext: row.url_ciphertext,
    hmac: row.url_hmac,
  })

  return Response.json(result)
}
