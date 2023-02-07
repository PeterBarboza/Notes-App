import { AxiosResponse } from "axios"
import { Router, useRouter } from "next/router"
import { useContext } from "react"
import { SHARED_CONSTANTS } from "../../../configs"

import { AuthContext } from "../../../contexts/authContext"
import { AuthServiceFactory } from "../../factories/authServiceFactory"

type descriptorMethod = (...args: any) => Promise<AxiosResponse<any>>

type ensureAuthenticatedParams = {
  optional?: boolean
}

export function EnsureAuthenticated({ optional = false }: ensureAuthenticatedParams) {
  return function(
    target: Object,
    key: Object | Symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod: descriptorMethod = descriptor.value
    const { setAuthContextData } = useContext(AuthContext)
    const router = useRouter()

    descriptor.value = async function (...args: any) {
      const result = await originalMethod.apply(this, args)

      const rt = localStorage.getItem(SHARED_CONSTANTS.localStorage.refreshTokenLabel)

      if(optional && !rt) {
        return result.data
      }

      if(result.status === 401 && result.data?.requestNewToken) {
        try {
          const authServices = new AuthServiceFactory().handle()
      
          if(rt) {
            const result = await authServices.authWithRefreshToken(rt)
        
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

            console.log("token refresh executed")
          }
        } catch (error) {
          console.log("token refresh failed")
          window.alert("É necessário refazer o login 🔒")
          router.push("/logout", { query: { redirectTo: "/login" } })
        }
      }

      if(result.status === 401 && result.data?.requestNewToken === false) {
        console.log("token refresh failed")
        window.alert("É necessário refazer o login 🔒")
        router.push("/logout", { query: { redirectTo: "/login" } })
      }

      return result.data
    }
  }
}