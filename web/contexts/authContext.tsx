import { createContext, ReactNode, useState } from "react"

export type authContextCredentials = {
  accessToken?: string
  userData?: {
    id: string,
    username: string
  }
}
export interface authContextParams extends authContextCredentials {
  setAuthContextData?: (args: authContextCredentials) => void
}

export const AuthContext = createContext<authContextParams>({})

type props = {
  children: ReactNode
}

export function AuthContextProvider({ children }: props) {
  const [authData, setAuthData] = useState<authContextCredentials>()

  const setAuthContextData = ({ accessToken, userData }: authContextCredentials) => {
    setAuthData({ accessToken, userData })
  }

  return (
    <AuthContext.Provider value={{
      accessToken: authData?.accessToken, 
      userData: authData?.userData,
      setAuthContextData: setAuthContextData
    }}>
      {children}
    </AuthContext.Provider>
  )
}