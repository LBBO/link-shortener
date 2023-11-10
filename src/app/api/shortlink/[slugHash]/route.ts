import { ShortlinkLookupResponse } from '@/app/shortlink.schema'

export const GET = async (
  req: Request,
  { params: { slugHash } }: { params: { slugHash: string } },
) => {
  console.log(slugHash)
  return Response.json({
    encryptedUrl: 'url',
  } satisfies ShortlinkLookupResponse)
}
