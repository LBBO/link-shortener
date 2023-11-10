'use client'

import { useEffect, useState } from 'react'
import { Card, CodeMockup, Input, Join } from 'react-daisyui'
import {
  EncryptedUrlData,
  encryptUrl,
  getHashAndKeyFromSlug,
} from '@/app/shortlink-crypto'

export default function DemoPage() {
  const [slug, setSlug] = useState('foobar')
  const [url, setUrl] = useState('https://google.com')
  const [encryptedUrl, setEncryptedUrl] = useState<EncryptedUrlData>()

  useEffect(() => {
    if (slug && url) {
      getHashAndKeyFromSlug(slug).then(async ({ hash, key }) => {
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
        </Card.Body>
      </Card>
    </div>
  )
}
