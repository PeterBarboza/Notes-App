import { useCallback, useContext } from "react"
import { toast } from "react-toastify"

import { ModalSelectInput } from "../../atoms/ModalSelectInput"
import { ModalSubmitInput } from "../../atoms/ModalSubmitInput"
import { ModalTextArea } from "../../atoms/ModalTextArea"
import { ModalTextInput } from "../../atoms/ModalTextInput"
import { BaseModal } from "../../molecules/BaseModal"
import { NOTE_PRIVACY_STATUS_OPTIONS } from "../../../shared/constants"
import { NotesServiceFactory } from "../../../services/factories/notesServiceFactory"
import { AuthContext } from "../../../contexts/authContext"

import { Note } from "../../../interface/schemas"

import styles from "./styles.module.scss"
import { fullUpdateNoteData } from "../../../services/shared/interface/requestParams"
import { useForm } from "react-hook-form"

type props = {
  entity: Note,
  isModalOpen: boolean
  closeModal: () => void
  onUpdateData?: (...args: any) => Promise<any>
}

const notesService = new NotesServiceFactory().handle()

export function EditNoteModal({ isModalOpen, closeModal, entity, onUpdateData }: props) {
  const { accessToken, userData } = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<fullUpdateNoteData>({
    defaultValues: {
      title: entity?.title,
      content: entity?.content,
      author: entity?.author?.id || userData?.id,
      privacyStatus: entity?.privacyStatus as "public" | "private"
    },
  })

  const onSubmit = useCallback(async (noteData: fullUpdateNoteData) => {
    notesService.accessToken = accessToken

    const toastId = toast.loading("Atualizando nota...")
    try {
      const result = await notesService.update(entity.id, {
        ...noteData,
        author: userData?.id!,
      })

      if (result?.data?.updatedCount === 1) {
        toast.update(toastId, {
          render: "Nota atuzalizada com suceso",
          type: "success",
          isLoading: false,
          autoClose: 1500,
          closeOnClick: true,
          closeButton: true,
        });
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

      setTimeout(() => {
        reset({}, { keepDefaultValues: true })
        closeModal()
      }, 500)
    } catch (error) {
      toast.update(toastId, {
        render: "Erro ao deletar nota",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
    } finally {
      if (onUpdateData) onUpdateData()
      closeModal()
    }
  }, [])

  return (
    <BaseModal
      heading="Editar nota"
      isOpen={isModalOpen}
      closeModal={closeModal}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <ModalTextInput
          inputProps={{
            ...register("title", {
              required: true,
              minLength: 1,
            }),
            required: true
          }}
          inputErrors={errors.title?.message}
          inputId="create-note-title-input"
          inputLabel="Título"
        />
        <ModalTextArea
          inputProps={{
            ...register("content", {
              required: true,
              minLength: 1,
            }),
            required: true
          }}
          inputErrors={errors.content?.message}
          inputId="create-note-.content-input"
          inputLabel="Conteúdo"
        />
        <ModalSelectInput
          inputId="3"
          inputName="privacy"
          inputLabel="Privacidade"
          exampleText=""
          onChange={(value) => setValue("privacyStatus", value as "public" | "private")}
          initialValue={
            NOTE_PRIVACY_STATUS_OPTIONS.find(option => option.value === entity.privacyStatus)
            ||
            NOTE_PRIVACY_STATUS_OPTIONS[0]
          }
          required={true}
          options={NOTE_PRIVACY_STATUS_OPTIONS}
        />
        <ModalSubmitInput
          inputDisplayText="Editar nota"
        />
      </form>
    </BaseModal>
  )
}
