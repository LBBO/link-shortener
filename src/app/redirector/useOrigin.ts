import { useIsClient } from '@/app/client-context'

export const useOrigin = () =>
  useIsClient() ? window.location.origin : undefined
