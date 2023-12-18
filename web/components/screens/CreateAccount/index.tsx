import { useCallback, useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import Link from "next/link"

import { AuthContext } from "../../../contexts/authContext"
import { UsersServiceFactory } from "../../../services/factories/usersServiceFactory"
import { SHARED_CONSTANTS } from "../../../configs"
import { AuthTextInput } from "../../atoms/AuthTextInput"
import { ModalSubmitInput } from "../../atoms/ModalSubmitInput"

import { createAccountParams } from "../../../services/shared/interface/requestParams"

import styles from "./styles.module.scss"
import { toast } from "react-toastify"

export function CreateAccount() {  
  const { accessToken, setAuthContextData } = useContext(AuthContext)
  const router = useRouter()
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<createAccountParams>()

  const onSubmit = useCallback(async (userData: createAccountParams) => {
    try {
      const usersService = new UsersServiceFactory().handle()

      const toastId = toast.loading("Criando conta...")

      const result: any = await usersService.create(userData)

      //TODO: Adicionar mensagens na validação dos inputs
      if(result.status !== 200) {

        //TODO: Traduzir mensagens que o usuário precisa ver (Aviso adicionado no backend)
        if(result.data?.message) {
          toast.update(toastId, { 
            render: result.data?.message, 
            type: "error", 
            isLoading: false,
            autoClose: 5000,
            closeOnClick: true,
            closeButton: true,
          });
          return
        }

        toast.update(toastId, { 
          render: "Erro ao criar conta", 
          type: "error", 
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
          closeButton: true,
        });
        return
      }
      
      toast.update(toastId, { 
        render: "Conta criada com sucesso", 
        type: "success", 
        isLoading: false,
        autoClose: 1000,
        closeOnClick: true,
        closeButton: true,
      });

      setTimeout(() => {
        toast.update(toastId, { 
          render: "Redirecionando...", 
          type: "info", 
          isLoading: false,
          autoClose: 2500,
          closeOnClick: true,
          closeButton: true,
        });
      }, 1000)

      setTimeout(() => router.push("login"), 2000)
    } catch (error) {}
  }, [])

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginBox}>
        <h1>Criar nova conta</h1>
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
            inputId="login-form-username"
            inputLabel="Nome de usuário"
            inputErrors={errors.username?.message}
            inputProps={{ 
              ...register("username", { required: true }),
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
            inputDisplayText="Criar conta"
          />
        </form>
        <div className={styles.redirectLinksBox}>
          <div className={styles.redirectButton}>
            <Link href="/login">
              <p>Acessar conta existente</p>
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
