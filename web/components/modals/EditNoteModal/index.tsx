import { FormEvent, useCallback, useContext, useState } from "react"
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

type props = {
  entity: Note,
  isModalOpen: boolean
  closeModal: () => void
}

const notesService = new NotesServiceFactory().handle()

export function EditNoteModal({ isModalOpen, closeModal, entity }: props) {
  const [title, setTitle] = useState<string>(entity.title)
  const [content, setContent] = useState<string>(entity.content)
  const [privacy, setPrivacy] = useState<string>(entity.privacyStatus)
  const { accessToken, userData } = useContext(AuthContext)
  
  const updateNote = useCallback(async (noteId: string, noteData: any) => {
    notesService.accessToken = accessToken
    
    const result = await notesService.update(noteId, { ...noteData, author: userData?.id })
  }, [])

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const noteData = { 
      title: title,
      content: content,
      privacyStatus: privacy
    }

    try {
      toast.promise(updateNote(entity.id, noteData), {
        pending: 'Atualizando nota...',
        success: 'Nota atualizada com suceso!',
        error: 'Falha na atuzalização da nota.'
      })
    } catch(err) {}
  }, [updateNote, title, content, userData, privacy, entity])

  const handleCloseModal = useCallback(() => {
    setTitle(entity.title)
    setContent(entity.content)
    setPrivacy(entity.privacyStatus)

    closeModal()
  }, [entity])

  return (
    <BaseModal
      heading="Editar nota"
      isOpen={isModalOpen}
      closeModal={handleCloseModal}
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
          initialValue={{ 
            id: NOTE_PRIVACY_STATUS_OPTIONS.find((status) => status.value === privacy)?.id!, 
            label: NOTE_PRIVACY_STATUS_OPTIONS.find((status) => status.value === privacy)?.label!,
            value: privacy 
          }}
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