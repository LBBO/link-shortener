'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { Theme } from 'react-daisyui'
import { ClientContextProvider } from '@/app/client-context'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const client = new QueryClient()

export const Providers = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={client}>
    <ReactQueryDevtools initialIsOpen={false} />
    <ClientContextProvider>
      <Theme dataTheme="dark">{children}</Theme>
    </ClientContextProvider>
  </QueryClientProvider>
)
