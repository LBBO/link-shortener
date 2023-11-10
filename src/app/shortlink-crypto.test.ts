import {
  encryptUrl,
  getHashAndKeyFromSlug,
  verifyANdDecrypt,
} from '@/app/shortlink-crypto'
import exp from 'constants'

it("hashing sanity check: shouldn't produce an immediate collision", async () => {
  const { hash: a } = await getHashAndKeyFromSlug('a')
  const { hash: b } = await getHashAndKeyFromSlug('b')
  expect(a).not.toBe('a')
  expect(a).not.toBe(b)
})

it('should be able to verify the MAC', async () => {
  const slug = 'foobar'
  const link = 'https://google.com'

  const { key } = await getHashAndKeyFromSlug(slug)
  const encryptedUrl = await encryptUrl(key, link)
  const decryptedUrl = await verifyANdDecrypt(key, encryptedUrl)

  expect(decryptedUrl).toBe(link)
})
