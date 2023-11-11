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

  if (hash.endsWith('?')) {
    return { slug: hash.slice(0, hash.length - 1), immediateRedirect: true }
  }

  return { slug: hash, shouldRedirectImmediately: true }
}
