import { useRouter } from "next/router"
import { ReactNode, useCallback } from "react"

import { useVerifyAuth } from "../../../shared/hooks/useVerifyAuth"

type props = {
  children: ReactNode
}

export function VerifyAuth({ children }: props) {
  const router = useRouter()

  const successCallback = useCallback(() => {
    const shouldRedirect = 
      router?.asPath === "/" || 
      router?.asPath === "/login" || 
      router?.asPath === "/app"

    if(shouldRedirect) {
      router.push("/app")
      return
    }
  }, [router])

  const errorCallback = useCallback(() => {
    window.alert("É necessário refazer o login 🔒")
    router.push({
      pathname: '/logout/redirect/[href]',
      query: { href: "login" },
    })
  }, [router])

  useVerifyAuth({ successCallback, errorCallback })

  return (
    <>
      {children}
    </>
  )
}