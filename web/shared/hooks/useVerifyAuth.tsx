import { useContext, useCallback, useEffect, useState } from "react"

import { SHARED_CONSTANTS } from "../../configs"
import { AuthContext } from "../../contexts/authContext"
import { AuthServiceFactory } from "../../services/factories/authServiceFactory"

type props = {
  errorCallback?: (...args: any) => void
  successCallback?: (...args: any) => void
}

type authResult = "pending" | "success" | "fail" | null

export function useVerifyAuth({ errorCallback, successCallback }: props) {
  const { setAuthContextData } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)
  const [authResult, setAuthResult] = useState<authResult>(null)

  const getCredentials = useCallback(async (refreshToken: string) => {
    try {
      setIsLoading(true)
      setAuthResult("pending")
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

      setAuthResult("success")

      if(successCallback) {
        successCallback()
      }
    } catch (error) {
      setAuthResult("fail")
      if(errorCallback) {
        errorCallback()
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const rt = localStorage.getItem(SHARED_CONSTANTS.localStorage.refreshTokenLabel)
    
    if(rt) {
      getCredentials(rt)
      return
    }
  }, [])

  return {
    isLoading,
    authResult
  }
}