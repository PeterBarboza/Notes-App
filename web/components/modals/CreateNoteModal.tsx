import { FormEvent, useState } from "react"

import { ModalRadioInput } from "../atoms/ModalRadioInput"
import { ModalSubmitInput } from "../atoms/ModalSubmitInput"
import { ModalTextArea } from "../atoms/ModalTextArea"
import { ModalTextInput } from "../atoms/ModalTextInput"
import { BaseModal } from "../molecules/BaseModal"

import styles from "./styles.module.scss"

type createNoteData = {
  title: string
  content: string
  privacy: string
}

type props = {
  isModalOpen: boolean
  closeModal: () => void
}

export function CreateNoteModal({ isModalOpen, closeModal }: props) {
  const [title, setTitle] = useState<string>()
  const [content, setContent] = useState<string>()
  const [privacy, setPrivacy] = useState<string>()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    console.log({
      title,
      content,
      privacy
    })
  }

  return (
    <BaseModal
    heading="Criar nova nota"
    isOpen={isModalOpen}
    closeModal={closeModal}
    >
      <form onSubmit={(event) => submit(event)} className={styles.form}>
        <ModalTextInput
          inputId="1"
          inputName="title"
          inputLabel="Título"
          exampleText=""
          onChange={setTitle}
          required
        />
        <ModalTextArea
          inputId="2"
          inputName="content"
          inputLabel="Conteúdo"
          exampleText=""
          onChange={setContent}
          required
        />
        <ModalRadioInput
          inputName="privacy"
          inputDisplayName="Privacidade"
          onChange={setPrivacy}
          required
          inputs={
            [
              {
                id: "123",
                label: "Público",
                value: "public"
              },
              {
                id: "321",
                label: "Privado",
                value: "private"
              }
            ]
          }
        />
        <ModalSubmitInput
          inputDisplayText="Criar nota"
        />
      </form>
    </BaseModal>
  )
}