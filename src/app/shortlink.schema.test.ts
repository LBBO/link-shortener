import { validSlugSchema, validUrlSchema } from '@/app/shortlink.schema'

describe('link validation', () => {
  it('should not allow a non-string', () => {
    const result = validUrlSchema.safeParse(1)
    expect(result.success).toBe(false)
  })

  it('should not allow undefined or null', () => {
    const results = [
      validUrlSchema.safeParse(undefined),
      validUrlSchema.safeParse(null),
    ]

    for (const result of results) {
      expect(result.success).toBe(false)
    }
  })

  it('should not allow an empty string', () => {
    const result = validUrlSchema.safeParse('')
    expect(result.success).toBe(false)
  })

  it('should allow a HTTPS url', () => {
    const result = validUrlSchema.safeParse(
      'https://sub.example.com/foo/bar?biz=baz#lol',
    )
    expect(result.success).toBe(true)
  })
})

describe('slug validation', () => {
  it('should not allow a non-string', () => {
    const result = validSlugSchema.safeParse(1)
    expect(result.success).toBe(false)
  })

  it('should not allow undefined or null', () => {
    const results = [
      validSlugSchema.safeParse(undefined),
      validSlugSchema.safeParse(null),
    ]

    for (const result of results) {
      expect(result.success).toBe(false)
    }
  })

  it('should not allow an empty string', () => {
    const result = validSlugSchema.safeParse('')
    expect(result.success).toBe(false)
  })

  it.each([' ', '.', '好', 'ä', '/', '#'])(
    'should not allow %p',
    (forbidden) => {
      const result = validSlugSchema.safeParse(`safe${forbidden}safe`)
      expect(result.success).toBe(false)
    },
  )

  it('should not allow - or _ at the beginning or the end', () => {
    const underscoreAtStart = validSlugSchema.safeParse('_safe')
    const underscoreAtEnd = validSlugSchema.safeParse('safe_')
    const dashAtStart = validSlugSchema.safeParse('-safe')
    const dashAtEnd = validSlugSchema.safeParse('safe-')

    expect(underscoreAtStart.success).toBe(false)
    expect(underscoreAtEnd.success).toBe(false)
    expect(dashAtStart.success).toBe(false)
    expect(dashAtEnd.success).toBe(false)
  })

  it('should allow a valid slug with all allowed special characters', () => {
    const result = validSlugSchema.safeParse('az09-_AZ')
    expect(result.success).toBe(true)
  })
})
