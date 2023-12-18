import { useRouter } from "next/router"
import { useCallback, useContext, useEffect, useState } from "react"
import { BsPersonCircle } from "react-icons/bs"
import { toast } from "react-toastify"

import { AuthContext } from "../../../contexts/authContext"
import { UsersServiceFactory } from "../../../services/factories/usersServiceFactory"
import { withRefreshTokenAuth } from "../../../services/shared/decorators/withRefreshTokenAuth"
import { BaseLayout } from "../../organisms/BaseLayout"
import { useGetNewCredentials } from "../../../shared/hooks/useGetNewCredentials"
import { AuthServiceFactory } from "../../../services/factories/authServiceFactory"
import { SHARED_CONSTANTS } from "../../../configs"

import { updateProfileParams } from "../../../services/shared/interface/requestParams"

import styles from "./styles.module.scss"

export function EditProfile() {
  const { accessToken, userData, setAuthContextData } = useContext(AuthContext)
  const [username, setUsername] = useState(userData?.username)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const getNewCredentials = useGetNewCredentials()

  const updateProfile = useCallback(async (updateData: Partial<updateProfileParams>) => {
    const toastId = toast.loading("Editando perfil...")
    setIsLoading(true)
    try {
      const usersServices = new UsersServiceFactory().handle()

      usersServices.accessToken = accessToken

      const result: any = await (withRefreshTokenAuth(
        usersServices.updateOne,
        {
          setAuthContextData: setAuthContextData!,
          routerInstance: router
        },
        { optional: true, thisArg: usersServices }
      ) as any)([userData?.id!, updateData])

      if(result?.data?.updatedCount === 1) {
        setAuthContextData!({
          accessToken,
          userData: {
            id: userData?.id!,
            username: updateData.username!
          }
        })

        toast.update(toastId, { 
          render: "Perfil editado com sucesso", 
          type: "success", 
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
          closeButton: true,
        });

        await getNewCredentials()
        return
      }

      if(result.data?.message) {
        toast.update(toastId, { 
          render: result.data?.message, 
          type: "error", 
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
          closeButton: true,
        })
        return
      }

      toast.update(toastId, { 
        render: "Erro ao editar perfil", 
        type: "error", 
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });

    } catch (error) {}
    finally {
      setIsLoading(false)
    }
  }, [accessToken, userData, getNewCredentials, setIsLoading])

  const isSubmitEnabled = useCallback(() => {
    if(isLoading) {
      return false
    }
    if(username?.length! < 2) {
      return false
    }
    if(userData?.username === username) {
      return false
    }
    
    return true
  }, [userData, username, isLoading])

  useEffect(() => {
    setUsername(userData?.username)
  }, [userData, setUsername])

  return (
    <BaseLayout>
      <div className={styles.userNotesProfileBox}>
        <h1>Editar Perfil</h1>
        <BsPersonCircle 
          size={100}
          color="#616161"
        />
        <form className={styles.form} onSubmit={(e) => { 
          e.preventDefault()
          updateProfile({ username })
        }}>
          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor="update-username">Nome de usuário</label>
            <input 
              id="update-username"
              value={username} 
              className={styles.input}
              onChange={(event) => {
                setUsername(event?.target?.value)
              }}
            />
          </div>
          <div className={styles.submitInputBox}>
            <input
              type="submit" 
              value="Salvar alterações"
              disabled={!isSubmitEnabled()}
              className={`
                ${styles.submitInput}
                ${isSubmitEnabled() ? "" : styles.disabledSubmitInput}
              `}
            />
          </div>
        </form>
        {/* Adicionar edição de dados de acesso (email e senha) */}
      </div>
    </BaseLayout>
  )
}