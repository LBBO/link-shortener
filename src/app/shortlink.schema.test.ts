import { Shortlink, shortlinkSchema } from '@/app/shortlink.schema'

const validShortlink: Shortlink = {
  link: 'https://google.com',
  slug: 'google',
}

it('should accept a valid shortlink', () => {
  const result = shortlinkSchema.safeParse(validShortlink)

  expect(result.success).toBe(true)
})

describe('link validation', () => {
  it('should not allow a non-string', () => {
    const result = shortlinkSchema.safeParse({
      ...validShortlink,
      link: 1,
    })

    expect(result.success).toBe(false)
  })

  it('should not allow undefined or null', () => {
    const results = [
      shortlinkSchema.safeParse({
        ...validShortlink,
        link: undefined,
      }),
      shortlinkSchema.safeParse({
        ...validShortlink,
        link: null,
      }),
    ]

    for (const result of results) {
      expect(result.success).toBe(false)
    }
  })

  it('should not allow an empty string', () => {
    const result = shortlinkSchema.safeParse({
      ...validShortlink,
      link: '',
    })

    expect(result.success).toBe(false)
  })

  it('should allow a HTTPS url', () => {
    const result = shortlinkSchema.safeParse({
      ...validShortlink,
      link: 'https://sub.example.com/foo/bar?biz=baz#lol',
    })

    expect(result.success).toBe(true)
  })
})

describe('slug validation', () => {
  it('should not allow a non-string', () => {
    const result = shortlinkSchema.safeParse({
      ...validShortlink,
      slug: 1,
    })

    expect(result.success).toBe(false)
  })

  it('should not allow undefined or null', () => {
    const results = [
      shortlinkSchema.safeParse({
        ...validShortlink,
        slug: undefined,
      }),
      shortlinkSchema.safeParse({
        ...validShortlink,
        slug: null,
      }),
    ]

    for (const result of results) {
      expect(result.success).toBe(false)
    }
  })

  it('should not allow an empty string', () => {
    const result = shortlinkSchema.safeParse({
      ...validShortlink,
      slug: '',
    })

    expect(result.success).toBe(false)
  })

  it.each([' ', '.', '好', 'ä', '/', '#'])(
    'should not allow %p',
    (forbidden) => {
      const result = shortlinkSchema.safeParse({
        ...validShortlink,
        slug: `safe${forbidden}safe`,
      })

      expect(result.success).toBe(false)
    },
  )

  it('should not allow - or _ at the beginning or the end', () => {
    const underscoreAtStart = shortlinkSchema.safeParse({
      ...validShortlink,
      slug: '_safe',
    })
    const underscoreAtEnd = shortlinkSchema.safeParse({
      ...validShortlink,
      slug: 'safe_',
    })
    const dashAtStart = shortlinkSchema.safeParse({
      ...validShortlink,
      slug: '-safe',
    })
    const dashAtEnd = shortlinkSchema.safeParse({
      ...validShortlink,
      slug: 'safe-',
    })

    expect(underscoreAtStart.success).toBe(false)
    expect(underscoreAtEnd.success).toBe(false)
    expect(dashAtStart.success).toBe(false)
    expect(dashAtEnd.success).toBe(false)
  })

  it('should allow a valid slug with all allowed special characters', () => {
    const result = shortlinkSchema.safeParse({
      ...validShortlink,
      slug: 'az09-_AZ',
    })

    expect(result.success).toBe(true)
  })
})
