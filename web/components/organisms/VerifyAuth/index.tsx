import { useRouter } from "next/router"
import { ReactNode, useCallback, useContext, useEffect } from "react"

import { AuthContext } from "../../../contexts/authContext"
import { AuthServiceFactory } from "../../../services/factories/authServiceFactory"

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

      localStorage.setItem("notes_app_refresh_token", result.data.refreshToken)

      setAuthContextData!({
        accessToken: result.data?.accessToken,
        userData: result.data?.userData
      })

      console.log("token refresh executed")

      router.push("/app")
    } catch (error) {
      //TODO: Aplicar o padrão de redirecionamento que está abaixo quando
      //a api dizer que o accessToken usado é invalido e precisa ser gerado
      //novamente para redirecionar para uma que também gere o refreshToken
      //ou para recarregar totalmente a página
      window.alert("É necessário refazer o login 🔒")
      router.push("/logout", { query: { redirectTo: "/login" } })
      console.log("token refresh failed")
    }
  }, [])

  useEffect(() => {
    const rt = localStorage.getItem("notes_app_refresh_token")
    
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