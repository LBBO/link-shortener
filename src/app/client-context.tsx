import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'

const clientContext = createContext(false)

export const ClientContextProvider = ({ children }: PropsWithChildren) => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <clientContext.Provider value={isClient}>{children}</clientContext.Provider>
  )
}

export const useIsClient = () => useContext(clientContext)
