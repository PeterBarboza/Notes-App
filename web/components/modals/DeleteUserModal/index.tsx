import { useCallback, useContext, useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { ModalSubmitInput } from "../../atoms/ModalSubmitInput"
import { ModalTextInput } from "../../atoms/ModalTextInput"
import { BaseModal } from "../../molecules/BaseModal"
import { AuthContext } from "../../../contexts/authContext"

import { deleteAccountParams } from "../../../services/shared/interface/requestParams"

import styles from "./styles.module.scss"
import { useRouter } from "next/router"
import { UsersServiceFactory } from "../../../services/factories/usersServiceFactory"
import { parseErrorsArray } from "../../../shared/utils/parseErrorsArray"

type props = {
  isModalOpen: boolean
  closeModal: () => void
  onUpdateData?: () => Promise<any>
}

export function DeleteUserModal({ isModalOpen, closeModal }: props) {
  const { accessToken, userData } = useContext(AuthContext)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<deleteAccountParams>({
    defaultValues: {
      password: ""
    },
  })

  const usersService = useMemo(() => new UsersServiceFactory().handle(accessToken), [accessToken])

  const onSubmit = useCallback(async (updateData: deleteAccountParams) => {
    const toastId = toast.loading("Editando perfil...")

    const redirectFunction = () => {
      toast.update(toastId, {
        render: "Conta excluída",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });

      router.push("/logout")

      router.events.on("routeChangeComplete", () => toast.dismiss(toastId))
      router.events.on("routeChangeError", () => toast.dismiss(toastId))
    }

    try {
      const result: any = await usersService.deleteAccount(userData?.id!, updateData)

      if (result?.data?.deletedCount === 1) {
        redirectFunction()

        return
      }

      const test = await usersService.getOneById(userData?.id!)

      if (test.status === 404) {
        redirectFunction()

        return
      }

      if (result.data?.message) {
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

      if (result.data?.errors) {
        toast.update(toastId, {
          render: parseErrorsArray(result.data?.errors),
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
          closeButton: true,
        })
        return
      }

      toast.update(toastId, {
        render: "Erro ao atualizar dados",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Erro ao atualizar dados",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
    }
  }, [userData])

  return (
    <BaseModal
      heading="Confirmar senha"
      isOpen={isModalOpen}
      closeModal={closeModal}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <ModalTextInput
          inputProps={{
            ...register("password", {
              required: true,
              minLength: 1,
            }),
            required: true
          }}
          inputErrors={errors.password?.message}
          inputId="delete-user-password-input"
          inputLabel="Senha"
        />
        <ModalSubmitInput
          inputDisplayText="Deletar perfil"
          style={{ backgroundColor: "#e60101" }}
        />
      </form>
    </BaseModal>
  )
}
