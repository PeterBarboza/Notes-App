import { createContext, ReactNode, useCallback, useEffect, useState } from "react"
import { AuthServiceFactory } from "../services/factories/authServiceFactory"

export type authContextParams = {
  accessToken?: string
}

export const AuthContext = createContext<authContextParams>({ 
  accessToken: undefined,
})

type props = {
  children: ReactNode
}

export default function AuthContextProvider({ children }: props) {
  const [authRequestFinished, setAuthRequestFinished] = useState(false)
  const [credentials, setCredentials] = useState<authContextParams>({
    accessToken: undefined
  })

  const getCredentials = useCallback(async (refreshToken: string) => {
    try {
      const authServices = new AuthServiceFactory().handle()
  
      setAuthRequestFinished(false)
      const result = await authServices.authWithRefreshToken(refreshToken)
  
      if(result.status !== 200) {
        throw new Error("RT Auth failed")
      }

      setCredentials({
        accessToken: result.data.accessToken
      })
      localStorage.setItem("notes_app_refresh_token", result.data.accessToken)
      setAuthRequestFinished(true)
      console.log("token refresh executed")
    } catch (error) {
      setCredentials({
        accessToken: undefined
      })
      setAuthRequestFinished(true)
      console.log("token refresh failed")
    }
  }, [])

  useEffect(() => {
    const rt = localStorage.getItem("notes_app_refresh_token")
    
    if(rt) {
      getCredentials(rt)
      return
    }
    setCredentials({
      accessToken: undefined
    })
  }, [])

  return authRequestFinished ? (
      <AuthContext.Provider value={{
        accessToken: credentials?.accessToken, 
      }}>
        {children}
      </AuthContext.Provider>
    )
    :
    <>
      {children}
    </>
}