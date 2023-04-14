import { useCallback, useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import Link from "next/link"

import { AuthContext } from "../../contexts/authContext"
import { AuthServiceFactory } from "../../services/factories/authServiceFactory"
import { SHARED_CONSTANTS } from "../../configs"

import { authWithEmailAndPasswordParams } from "../../services/shared/interface/requestParams"

import styles from "./login.module.scss"
import { AuthTextInput } from "../atoms/AuthTextInput"
import { ModalSubmitInput } from "../atoms/ModalSubmitInput"

export function Login() {  
  const { accessToken, setAuthContextData } = useContext(AuthContext)
  const router = useRouter()
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<authWithEmailAndPasswordParams>()

  const onSubmit = useCallback(async ({ email, password }: authWithEmailAndPasswordParams) => {
    try {
      const authService = new AuthServiceFactory().handle()

      const result = await authService.authWithEmailAndPassword(email, password)

      if(result.status != 200) {
        throw new Error("Auth Failed")
      }
      
      localStorage.setItem(
        SHARED_CONSTANTS.localStorage.refreshTokenLabel,
        result.data.refreshToken
      )

      setAuthContextData!({
        accessToken: result.data.accessToken,
        userData: result.data.user
      })
      
      router.push("/app")
    } catch (error) {}
  }, [])

  useEffect(() => {
    if(accessToken) router.push("/app")
  }, [])

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginBox}>
        <h1>Acessar sua conta</h1>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <AuthTextInput
            inputId="login-form-email"
            inputLabel="Email"
            inputErrors={errors.email?.message}
            inputProps={{ 
              ...register("email", { required: true }),
              required: true
            }}
          />
          <AuthTextInput
            inputId="login-form-password"
            inputLabel="Senha"
            inputErrors={errors.password?.message}
            inputProps={{ 
              ...register("password", { required: true }) ,
              required: true
            }}
          />
          <ModalSubmitInput
            inputDisplayText="Fazer login"
          />
        </form>
        <div className={styles.redirectLinksBox}>
          <div className={styles.redirectButton}>
            <Link href="/criar-conta">
              <p>Criar conta</p>
            </Link>
          </div>
          <div className={styles.redirectButton}>
            <Link href="/app">
              <p>Continuar sem login</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
