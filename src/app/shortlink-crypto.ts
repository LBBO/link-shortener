import * as crypto from 'crypto'
import { BinaryLike } from 'crypto'
import zod from 'zod'
import { EncryptedUrlData } from '@/app/shortlink.schema'

const cipherName = 'aes-256-gcm'

const hash = async (slug: BinaryLike) => {
  // The salt here is constant as we cannot use actual salt.
  // If we used actual salt, the slug would have to be hashed
  // with the slug ov EVERY link saved in the database.
  const salt = zod.string().parse(process.env.NEXT_PUBLIC_SLUG_HASHING_SALT)
  const iterations = zod
    .number({ coerce: true })
    .parse(process.env.NEXT_PUBLIC_SLUG_HASHING_ITERATIONS)
  return crypto.pbkdf2Sync(slug, salt, iterations, 32, 'sha512')
}

export const getHashAndKeyFromSlug = async (slug: string) => {
  const key = await hash(slug)
  const finalHash = await hash(key)
  return { key, hash: finalHash.toString('base64') }
}

const createHmac = async (key: Buffer, ciphertext: Buffer) => {
  const hmacAlgo = crypto.createHmac('sha512', key)
  return hmacAlgo.update(ciphertext).digest()
}

export const encryptUrl = async (key: Buffer, url: string) => {
  const iv = crypto.randomBytes(32)
  const cipher = crypto.createCipheriv(cipherName, key, iv)
  const ciphertext = Buffer.concat([cipher.update(url, 'utf8'), cipher.final()])
  const hmac = await createHmac(key, ciphertext)

  return {
    iv: iv.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
    hmac: hmac.toString('base64'),
  } satisfies EncryptedUrlData
}

export const verifyAndDecrypt = async (
  key: Buffer,
  {
    hmac: expectedHmacStr,
    ciphertext: ciphertextStr,
    iv: ivStr,
  }: EncryptedUrlData,
) => {
  const ciphertext = Buffer.from(ciphertextStr, 'base64')
  const iv = Buffer.from(ivStr, 'base64')
  const actualHmac = await createHmac(key, ciphertext)
  const isValid = actualHmac.toString('base64') === expectedHmacStr

  if (!isValid) {
    throw new Error(
      'The shortlink seems to have been altered after the fact. You will not be redirected!',
    )
  }

  const cipher = crypto.createDecipheriv(cipherName, key, iv)
  const cleartext = Buffer.concat([cipher.update(ciphertext)])

  return cleartext.toString('utf8')
}
