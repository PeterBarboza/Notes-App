import { DetailedHTMLProps, TextareaHTMLAttributes } from "react"

import styles from "./styles.module.scss"

type props = {
  inputId: string
  inputLabel: string
  inputErrors?: string
  inputProps: DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
}

export function ModalTextArea({
  inputId,
  inputLabel,
  inputErrors,
  inputProps
}: props) {
  return (
    <div className={styles.modalTextArea}>
      <label htmlFor={inputId}>
        {inputLabel}
        {
          inputProps?.required ?
            <span className={styles.errorsBox}> *</span>
            :
            null
        }
      </label>
      {
        inputErrors ? 
          <span className={styles.errorsBox}>{inputErrors}</span>
          :
          null
      }
      <textarea
        id={inputId}
        className={styles.textArea}        
        {...inputProps}
      />
    </div>
  )
}