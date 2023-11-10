'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { Theme } from 'react-daisyui'
import { ClientContextProvider } from '@/app/client-context'

const client = new QueryClient()

export const Providers = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={client}>
    <ClientContextProvider>
      <Theme dataTheme="dark">{children}</Theme>
    </ClientContextProvider>
  </QueryClientProvider>
)
