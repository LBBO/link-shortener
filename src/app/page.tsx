'use client'

import { Redirector } from '@/app/redirector'
import { useSlugFromUrl } from '@/app/redirector/useSlugFromUrl'
import { CreateShortLinkForm } from '@/app/create-short-link-form'

export default function Home() {
  const slugData = useSlugFromUrl()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {slugData ? <Redirector /> : <CreateShortLinkForm />}
    </main>
  )
}
