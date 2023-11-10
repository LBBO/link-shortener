import zod from 'zod'

export const shortlinkSchema = zod.object({
  link: zod.string().url(),
  slug: zod
    .string()
    .regex(/^[a-z\-_0-9]+$/i)
    .regex(/^[a-z0-9]/i, 'Your slug must start with an alphanumeric character')
    .regex(/[a-z0-9]$/i, 'Your slug must end with an alphanumeric character'),
})

export type Shortlink = zod.infer<typeof shortlinkSchema>
