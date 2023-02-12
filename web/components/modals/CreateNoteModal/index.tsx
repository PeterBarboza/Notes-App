import { useCallback, useContext } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { ModalSelectInput } from "../../atoms/ModalSelectInput"
import { ModalSubmitInput } from "../../atoms/ModalSubmitInput"
import { ModalTextArea } from "../../atoms/ModalTextArea"
import { ModalTextInput } from "../../atoms/ModalTextInput"
import { BaseModal } from "../../molecules/BaseModal"
import { NotesServiceFactory } from "../../../services/factories/notesServiceFactory"
import { AuthContext } from "../../../contexts/authContext"
import { NOTE_PRIVACY_STATUS_OPTIONS } from "../../../shared/constants"

import { createNoteData } from "../../../services/shared/interface/requestParams"

import styles from "./styles.module.scss"

type props = {
  isModalOpen: boolean
  closeModal: () => void
}

const notesService = new NotesServiceFactory().handle()

export function CreateNoteModal({ isModalOpen, closeModal }: props) {
  const { accessToken, userData } = useContext(AuthContext)
  const { 
    register, 
    handleSubmit, 
    setValue,
    reset,
    formState: { errors } ,
  } = useForm<createNoteData>({
    defaultValues: {
      title: "",
      content: "",
      author: userData?.id,
      privacyStatus: "private"
    },
  })

  const onSubmit = useCallback(async (noteData: createNoteData) => {
    notesService.accessToken = accessToken
  
    console.log(noteData)
    try {      
      const response = await toast.promise(
        notesService.create({
          ...noteData,
          author: userData?.id!,
        }),
        {
          pending: 'Criando nota...',
          success: 'Nota criada com suceso!',
          error: 'Falha na criação da nota.'
        }
      )

      setTimeout(() => {
        reset({}, { keepDefaultValues: true })
        closeModal()
      }, 500)
    } catch (error) {}
  }, [])

  return (
    <BaseModal
    heading="Criar nova nota"
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
          initialValue={NOTE_PRIVACY_STATUS_OPTIONS[0]}
          required={true}
          options={NOTE_PRIVACY_STATUS_OPTIONS}
        />
        <ModalSubmitInput 
          inputDisplayText="Criar nota"
        />
      </form>
    </BaseModal>
  )
}
