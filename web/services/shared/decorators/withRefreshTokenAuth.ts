import { NextRouter } from "next/router"
import { AxiosResponse } from "axios"

import { SHARED_CONSTANTS } from "../../../configs"
import { AuthServiceFactory } from "../../factories/authServiceFactory"

type ensureAuthenticatedParams = {
  optional?: boolean,
  thisArg?: { [key: string]: any }
}
type dependenciesParam = {
  setAuthContextData: (args: any) => any
  routerInstance: NextRouter
}

export function withRefreshTokenAuth<T extends (...args: any) => Promise<AxiosResponse<any, any>>>(
    decoratedMethod: T,
    deps: dependenciesParam,
    options?: ensureAuthenticatedParams
  ) {
  return async function(methodParams: Parameters<T>): Promise<ReturnType<typeof decoratedMethod> | void> {
    const { setAuthContextData, routerInstance: router } = deps
  
    const result = await decoratedMethod.apply({...(options?.thisArg || {})}, [methodParams])
  
    const rt = localStorage.getItem(SHARED_CONSTANTS.localStorage.refreshTokenLabel)
  
    if(options?.optional && !rt) {
      return result as ReturnType<T>
    }
  
    if(result?.status === 401 && result?.data?.requestNewToken) {
      try {
        if(!rt) throw new Error("RT Auth failed")
  
        const authServices = new AuthServiceFactory().handle()
        const result = await authServices.authWithRefreshToken(rt)
    
        if(result?.status !== 200) {
          throw new Error("RT Auth failed")
        }
  
        localStorage.setItem(
          SHARED_CONSTANTS.localStorage.refreshTokenLabel, 
          result?.data?.refreshToken
        )
  
        setAuthContextData!({
          accessToken: result?.data?.accessToken,
          userData: result?.data?.user
        })
  
        return await decoratedMethod.apply({
          ...(options?.thisArg || {}),
          accessToken: result?.data?.accessToken  
        }, 
        [methodParams]
        ) as ReturnType<T>
      } catch (error) {
        window.alert("É necessário refazer o login 🔒")
        router.push({
          pathname: '/logout/redirect/[href]',
          query: { href: "login" },
        })
      }
    }
  
    if(result?.status === 401 && result?.data?.requestNewToken === false) {
      window.alert("É necessário refazer o login 🔒")
      router.push({
        pathname: "/logout/redirect/[href]",
        query: { href: "login" },
      })
    }
  
    return result as ReturnType<T>
  }
}