import { useCallback, useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import Link from "next/link"
import { toast } from "react-toastify"

import { AuthContext } from "../../../contexts/authContext"
import { UsersServiceFactory } from "../../../services/factories/usersServiceFactory"
import { AuthTextInput } from "../../atoms/AuthTextInput"
import { ModalSubmitInput } from "../../atoms/ModalSubmitInput"
import { AuthPasswordInput } from "../../atoms/AuthPasswordInput"
import { useVerifyPasswordFormat } from "../../../shared/hooks/useVerifyPasswordFormat"
import { parseErrorsArray } from "../../../shared/utils/parseErrorsArray"

import { createAccountParams } from "../../../services/shared/interface/requestParams"

import styles from "./styles.module.scss"
import { useVerifyUsernameFormat } from "../../../shared/hooks/useVerifyUsernameFormat"

export function CreateAccount() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<createAccountParams>()
  const [password, setPassword] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    isValid: isValidPassword,
    charsLength,
    lowerCase,
    numbers,
    specialChars,
    upperCase
  } = useVerifyPasswordFormat(password)
  const {
    isValid: isValidUsername,
    letters: usernameLetters,
    charsLength: usernameCharsLength,
    specialChars: usernameSpecialChars,
  } = useVerifyUsernameFormat(username)

  const onSubmit = useCallback(async (userData: createAccountParams) => {
    const toastId = toast.loading("Criando conta...")
    setIsLoading(true)
    try {
      const usersService = new UsersServiceFactory().handle()

      const result: any = await usersService.create(userData)

      if (result.status !== 200) {
        if (result.data?.message) {
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

        if (result?.data?.errors?.length > 0) {
          toast.update(toastId, {
            render: parseErrorsArray(result?.data?.errors),
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
    } catch (error) {
      toast.update(toastId, {
        render: "Erro ao criar conta",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      })
    } finally {
      setIsLoading(false)
    }
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
          <div className={styles.inputWrapper}>
            <AuthTextInput
              inputId="login-form-username"
              inputLabel="Nome de usuário"
              inputErrors={errors.username?.message}
              inputProps={{
                ...register("username", { required: true }),
                required: true,
                onChange: (event) => {
                  setUsername(event?.target?.value || "")
                  setValue("password", event?.target?.value || "")
                },
                value: username
              }}
            />
            <ul className={styles.errorsBox}>
              <li className={usernameCharsLength ? styles.passwordInstructionPassed : ""}>* O nome de usuário deve conter no mínimo 2 caracteres;</li>
              <li className={usernameLetters ? styles.passwordInstructionPassed : ""}>* Duas letras;</li>
              <li className={usernameSpecialChars ? styles.passwordInstructionPassed : ""}>* Caracteres especiais: Apenas hifens(-), underlines(_), e pontos(.) são permitidos</li>
            </ul>
          </div>
          <div className={styles.inputWrapper}>
            <AuthPasswordInput
              inputId="login-form-password"
              inputLabel="Senha"
              inputProps={{
                ...register("password", { required: true }),
                required: true,
                onChange: (event) => {
                  setPassword(event?.target?.value || "")
                  setValue("password", event?.target?.value || "")
                },
                value: password
              }}
            />
            <ul className={styles.errorsBox}>
              <li className={charsLength ? styles.passwordInstructionPassed : ""}>* A senha deve conter no mínimo 8 caracteres;</li>
              <li className={upperCase ? styles.passwordInstructionPassed : ""}>* Uma letra maiúscula;</li>
              <li className={lowerCase ? styles.passwordInstructionPassed : ""}>* Uma letra minúscula;</li>
              <li className={numbers ? styles.passwordInstructionPassed : ""}>* Um número;</li>
              <li className={specialChars ? styles.passwordInstructionPassed : ""}>* Um caractere especial;</li>
            </ul>
          </div>
          <ModalSubmitInput
            inputDisplayText="Criar conta"
            disabled={
              (isValidPassword === false)
              ||
              (isValidUsername === false)
              ||
              isLoading
            }
          />
        </form>
        <div className={styles.redirectLinksBox}>
          <div className={styles.redirectButton}>
            <Link href="/login">
              <p>Acessar conta existente</p>
            </Link>
          </div>
          <div className={styles.redirectButton}>
            <Link href="/app/notas-publicas">
              <p>Continuar sem login</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
