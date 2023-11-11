import { useEffect, useState } from 'react'

export const useSlugFromUrl = () => {
  const [hash, setHash] = useState<string>()

  useEffect(() => {
    const updateHash = () => {
      setHash(window.location.hash.slice(1))
    }

    updateHash()
    window.addEventListener('hashchange', updateHash)

    return () => window.removeEventListener('hashchange', updateHash)
  }, [])

  if (!hash) {
    return undefined
  }

  return {
    slug: hash.replaceAll('?', ''),
    shouldRedirectImmediately: !hash.includes('?'),
  }
}
