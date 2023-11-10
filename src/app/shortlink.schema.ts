import zod from 'zod'

export const shortlinkCreateSchema = zod.object({
  link: zod.string().url(),
  slug: zod
    .string()
    .regex(/^[a-z\-_0-9]+$/i)
    .regex(/^[a-z0-9]/i, 'Your slug must start with an alphanumeric character')
    .regex(/[a-z0-9]$/i, 'Your slug must end with an alphanumeric character'),
})

export type ShortlinkCreate = zod.infer<typeof shortlinkCreateSchema>

export const shortlinkLookupResponseSchema = zod.object({
  encryptedUrl: zod.string(),
})

export type ShortlinkLookupResponse = zod.infer<
  typeof shortlinkLookupResponseSchema
>
