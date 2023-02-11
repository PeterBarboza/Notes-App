import { useRouter } from "next/router"
import { ReactNode, useCallback, useContext, useEffect } from "react"

import { AuthContext } from "../../../contexts/authContext"
import { AuthServiceFactory } from "../../../services/factories/authServiceFactory"
import { SHARED_CONSTANTS } from "../../../configs"

type props = {
  children: ReactNode
}

export function VerifyAuth({ children }: props) {
  const { setAuthContextData } = useContext(AuthContext)
  const router = useRouter()

  const getCredentials = useCallback(async (refreshToken: string) => {
    try {
      const authServices = new AuthServiceFactory().handle()
  
      const result = await authServices.authWithRefreshToken(refreshToken)
  
      if(result.status !== 200) {
        throw new Error("RT Auth failed")
      }

      localStorage.setItem(
        SHARED_CONSTANTS.localStorage.refreshTokenLabel, 
        result.data.refreshToken
      )

      setAuthContextData!({
        accessToken: result.data?.accessToken,
        userData: result.data?.user
      })

      router.push("/app")
    } catch (error) {
      window.alert("É necessário refazer o login 🔒")
      router.push({
          pathname: '/logout/redirect/[href]',
          query: { href: "/login" },
        })
    }
  }, [])

  useEffect(() => {
    const rt = localStorage.getItem(SHARED_CONSTANTS.localStorage.refreshTokenLabel)
    
    if(rt) {
      getCredentials(rt)
      return
    }
  }, [])

  return (
    <>
      {children}
    </>
  )
}