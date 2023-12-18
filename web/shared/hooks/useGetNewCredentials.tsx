import { useContext, useCallback, useEffect, useState } from "react"

import { SHARED_CONSTANTS } from "../../configs"
import { AuthContext } from "../../contexts/authContext"
import { AuthServiceFactory } from "../../services/factories/authServiceFactory"

export function useGetNewCredentials(): () => Promise<void> {
  const { accessToken, setAuthContextData } = useContext(AuthContext)

  
  const getTokensWithNewCredentials = useCallback(async (executions = 1): Promise<void> => {
    const authServices = new AuthServiceFactory().handle()
    
    try {
      const rt = localStorage.getItem(SHARED_CONSTANTS.localStorage.refreshTokenLabel)
      const result = await authServices.authWithRefreshToken(rt!)

      if(result.status === 200) {
        setAuthContextData!({
          accessToken: result?.data?.accessToken,
          userData: {
            id: result?.data?.user?.id,
            username: result?.data?.user?.username,
          }
        })

        return
      }

      throw new Error("RT revalidation failed")
    } catch (error) {
      if(executions >= 3) {
        return
      }
      return await getTokensWithNewCredentials(executions++)
    }

  }, [setAuthContextData, accessToken])

  return getTokensWithNewCredentials
}