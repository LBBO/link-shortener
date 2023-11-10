import { getDbClient } from '@/app/api/db-connection'
import { shortlinkCreateSchema } from '@/app/shortlink.schema'

export const POST = async (request: Request) => {
  const parsed = shortlinkCreateSchema.safeParse(await request.json())

  if (!parsed.success) {
    return new Response(null, {
      status: 400,
      statusText: 'Bad Request',
    })
  }

  const data = parsed.data
  const dbClient = await getDbClient()
  try {
    const inserted = await dbClient.query(
      `
                INSERT INTO shortlinks
                    (slug_hash, url_iv, url_ciphertext, url_hmac, expiration_date)
                VALUES ($1, $2, $3, $4, $5)
            `,
      [
        data.slugHash,
        data.url.iv,
        data.url.ciphertext,
        data.url.hmac,
        data.expirationDate,
      ],
    )
    return Response.json({})
  } catch (e) {
    return new Response(null, {
      status: 400,
      statusText: 'Bad Request',
    })
  }
}
