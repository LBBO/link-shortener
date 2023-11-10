'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { Theme } from 'react-daisyui'

const client = new QueryClient()

export const Providers = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={client}>
    <Theme dataTheme="dark">{children}</Theme>
  </QueryClientProvider>
)
