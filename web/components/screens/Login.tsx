import { useCallback, useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import Link from "next/link"

import { AuthContext } from "../../contexts/authContext"
import { AuthServiceFactory } from "../../services/factories/authServiceFactory"

import { authWithEmailAndPasswordParams } from "../../services/shared/interface/requestParams"

import styles from "./login.module.scss"

export type userLoginData = {
  email: string
  password: string
}

const authService = new AuthServiceFactory().handle()

export function Login() {  
  const { accessToken, userData, setAuthContextData } = useContext(AuthContext)
  const router = useRouter()
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<authWithEmailAndPasswordParams>()

  const onSubmit = useCallback(async ({ email, password }: authWithEmailAndPasswordParams) => {
    try {
      const result = await authService.authWithEmailAndPassword(email, password)

      if(result.status != 200) {
        throw new Error("Auth Failed")
      }
      
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
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formField}>
            <label htmlFor="login-form-email">Email</label>
            <input 
              id="login-form-email"
              { ...register("email", { required: true }) }
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="login-form-password">Password</label>
            <input
              id="login-form-password"
              { ...register("password", { required: true }) }
              required
            />
          </div>

          <input
            type="submit"
            value="Fazer Login"
            className={styles.inputSubmit}
          />
        </form>
        <div className={styles.continueWithoutLogin}>
          <Link href="/app">
            <p>Continuar sem login</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
