import { FormEvent, useCallback, useContext, useState } from "react"
import { toast } from "react-toastify"

import { ModalSelectInput } from "../../atoms/ModalSelectInput"
import { ModalSubmitInput } from "../../atoms/ModalSubmitInput"
import { ModalTextArea } from "../../atoms/ModalTextArea"
import { ModalTextInput } from "../../atoms/ModalTextInput"
import { BaseModal } from "../../molecules/BaseModal"
import { NOTE_PRIVACY_STATUS_OPTIONS } from "../../../shared/constants"

import styles from "./styles.module.scss"
import { NotesServiceFactory } from "../../../services/factories/notesServiceFactory"
import { AuthContext } from "../../../contexts/authContext"

type props = {
  isModalOpen: boolean
  closeModal: () => void
}

const notesService = new NotesServiceFactory().handle()

export function CreateNoteModal({ isModalOpen, closeModal }: props) {
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [privacy, setPrivacy] = useState<string>(NOTE_PRIVACY_STATUS_OPTIONS[0].value)
  const { accessToken, userData } = useContext(AuthContext)

  const createNote = useCallback(async (noteData: any) => {
    notesService.accessToken = accessToken
    
    const result = await notesService.create(noteData)
  }, [])

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const noteData = { 
      title: title,
      content: content,
      author: userData?.id!,
      privacyStatus: privacy
    }

    try {
      toast.promise(createNote(noteData), {
        pending: 'Criando nota...',
        success: 'Nota criada com suceso!',
        error: 'Falha na criação da nota.'
      })
    } catch(err) {}
  }, [createNote, title, content, userData, privacy])

  return (
    <BaseModal
    heading="Criar nova nota"
    isOpen={isModalOpen}
    closeModal={closeModal}
    >
      <form onSubmit={(event) => handleSubmit(event)} className={styles.form}>
        <ModalTextInput
        actualValue={title}
          inputId="1"
          inputName="title"
          inputLabel="Título"
          exampleText=""
          onChange={setTitle}
          required
        />
        <ModalTextArea
        actualValue={content}
          inputId="2"
          inputName="content"
          inputLabel="Conteúdo"
          exampleText=""
          onChange={setContent}
          required
        />
        <ModalSelectInput
          inputId="3"
          inputName="privacy"
          inputLabel="Privacidade"
          exampleText=""
          onChange={setPrivacy}
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