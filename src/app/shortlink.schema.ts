import zod from 'zod'

export const validUrlSchema = zod.string().url('This is not a valid URL!')

export const validSlugSchema = zod
  .string()
  .regex(/^[a-z\-_0-9]+$/i)
  .regex(/^[a-z0-9]/i, 'Your slug must start with an alphanumeric character')
  .regex(/[a-z0-9]$/i, 'Your slug must end with an alphanumeric character')

export const encryptedUrlDataSchema = zod.object({
  iv: zod.string(),
  ciphertext: zod.string(),
  hmac: zod.string(),
})

export type EncryptedUrlData = zod.infer<typeof encryptedUrlDataSchema>

export const shortlinkCreateSchema = zod.object({
  slugHash: zod.string(),
  url: encryptedUrlDataSchema,
  expirationDate: zod.date({ coerce: true }).optional(),
})

export type ShortlinkCreate = zod.infer<typeof shortlinkCreateSchema>
