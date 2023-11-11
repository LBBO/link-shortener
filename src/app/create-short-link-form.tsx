'use client'

import { useState } from 'react'
import {
  ShortlinkCreate,
  validSlugSchema,
  validUrlSchema,
} from '@/app/shortlink.schema'
import { useMutation } from '@tanstack/react-query'
import { encryptUrl, getHashAndKeyFromSlug } from '@/app/shortlink-crypto'
import { Button, Card, Input } from 'react-daisyui'
import { useOrigin } from '@/app/redirector/useOrigin'
import { Dialog } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import zod from 'zod'

const formStateSchema = zod.object({
  slug: validSlugSchema,
  url: validUrlSchema,
})
type FormState = zod.infer<typeof formStateSchema>

export const CreateShortLinkForm = () => {
  const origin = useOrigin()
  const [showAlreadyTakenDialog, setShowAlreadyTakenDialog] = useState(false)
  const [showCreatedDialog, setShowCreatedDialog] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    reset,
  } = useForm<FormState>({
    resolver: zodResolver(formStateSchema),
    mode: 'onChange',
  })

  const createShortlink = useMutation({
    mutationKey: [],
    mutationFn: async ({ slug, url }: FormState) => {
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
    onSuccess: () => {
      setShowCreatedDialog(true)
      reset()
    },
    onError: () => {
      setShowAlreadyTakenDialog(true)
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit((data) => createShortlink.mutate(data))}>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">What URL do you want to shorten?</span>
          </div>
          <Input {...register('url')} placeholder="https://..." />
          <div className="label">
            <ul className="label-text-alt text-error">{errors.url?.message}</ul>
          </div>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Slug</span>
          </div>
          <Input placeholder="my-crazy-link" {...register('slug')} />
          <div className="label">
            <ul className="label-text-alt text-error">
              {errors.slug?.message}
            </ul>
          </div>
        </label>
        <Button tag="input" type="submit" value="Create" disabled={!isValid} />
      </form>

      <Dialog
        open={showAlreadyTakenDialog}
        onClose={() => setShowAlreadyTakenDialog(false)}
        className="fixed inset-0 z-50"
      >
        <div className="fixed inset-0 bg-black/25"></div>
        <Dialog.Panel className="w-full h-full grid place-content-center">
          <Card className="bg-base-100 shadow-xl">
            <Card.Body>
              <Card.Title tag="h2">
                <Dialog.Title>That slug is already taken</Dialog.Title>
              </Card.Title>
              <Dialog.Description>
                Please try choosing a different slug
              </Dialog.Description>
              <Card.Actions className="justify-end">
                <Button
                  color="primary"
                  onClick={() => setShowAlreadyTakenDialog(false)}
                >
                  Ok
                </Button>
              </Card.Actions>
            </Card.Body>
          </Card>
        </Dialog.Panel>
      </Dialog>

      <Dialog
        open={showCreatedDialog}
        onClose={() => setShowCreatedDialog(false)}
        className="fixed inset-0 z-50"
      >
        <div className="fixed inset-0 bg-black/25"></div>
        <Dialog.Panel className="w-full h-full grid place-content-center">
          <Card className="bg-base-100 shadow-xl">
            <Card.Body>
              <Card.Title tag="h2">
                <Dialog.Title>Your URL was created successfully!</Dialog.Title>
              </Card.Title>
              <Dialog.Description>
                <a
                  href={`${origin}/#${getValues('slug')}`}
                  className="underline"
                >
                  {origin}/#{getValues('slug')}
                </a>{' '}
                -&gt;{' '}
                <a href={getValues('url')} className="underline">
                  {getValues('url')}
                </a>
              </Dialog.Description>
              <Card.Actions className="justify-end">
                <Button
                  color="primary"
                  onClick={() => setShowCreatedDialog(false)}
                >
                  Ok
                </Button>
              </Card.Actions>
            </Card.Body>
          </Card>
        </Dialog.Panel>
      </Dialog>
    </div>
  )
}
