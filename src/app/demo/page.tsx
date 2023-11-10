'use client'

import { useEffect, useState } from 'react'
import { Button, Card, Input, Join } from 'react-daisyui'
import { encryptUrl, getHashAndKeyFromSlug } from '@/app/shortlink-crypto'
import { useMutation } from '@tanstack/react-query'
import { EncryptedUrlData, ShortlinkCreate } from '@/app/shortlink.schema'

export default function DemoPage() {
  const [slug, setSlug] = useState('foobar')
  const [url, setUrl] = useState('https://google.com')
  const [encryptedUrl, setEncryptedUrl] = useState<EncryptedUrlData>()
  const [hash, setHash] = useState<string>()

  const createSchema = useMutation({
    mutationKey: [],
    mutationFn: async () => {
      const { key, hash } = await getHashAndKeyFromSlug(slug)
      const encryptedUrl = await encryptUrl(key, url)
      const body: ShortlinkCreate = {
        slugHash: hash,
        url: encryptedUrl,
      }
      const response = await fetch('api/shortlink/manage', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      return response.json()
    },
  })

  useEffect(() => {
    if (slug && url) {
      getHashAndKeyFromSlug(slug).then(async ({ hash, key }) => {
        setHash(hash)
        setEncryptedUrl(await encryptUrl(key, url))
      })
    }
  }, [slug, url])

  return (
    <div>
      <Card>
        <Card.Title>Foobar</Card.Title>
        <Card.Body>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Join className="items-center gap-2">
              <span>https://your-domain.com/#</span>
              <Input
                placeholder="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </Join>
          </div>
          {encryptedUrl && (
            <div className="flex flex-col gap-4">
              <div className="flex">
                Hash:&nbsp;<code>{hash}</code>
              </div>
              <div className="flex">
                Ciphertext:&nbsp;<code>{encryptedUrl.ciphertext}</code>
              </div>
              <div className="flex">
                IV:&nbsp;<code>{encryptedUrl.iv}</code>
              </div>
              <div className="flex">
                HMAC:&nbsp;<code>{encryptedUrl.hmac}</code>
              </div>
            </div>
          )}
          {createSchema.data && (
            <div>
              <code>{JSON.stringify(createSchema.data, null, 2)}</code>
            </div>
          )}
        </Card.Body>
        <Card.Actions>
          <Button onClick={() => createSchema.mutate()}>Create</Button>
        </Card.Actions>
      </Card>
    </div>
  )
}
