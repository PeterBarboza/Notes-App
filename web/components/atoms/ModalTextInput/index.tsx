import { DetailedHTMLProps, InputHTMLAttributes } from "react"
import styles from "./styles.module.scss"

interface props {
  inputId: string
  inputLabel: string
  inputErrors?: string
  inputProps: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
}

export function ModalTextInput({
  inputId,
  inputLabel,
  inputErrors,
  inputProps
}: props) {
  return (
    <div className={styles.modalTextInput}>
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
      <input
        id={inputId}
        type="text"
        className={styles.textInput}
        {...inputProps}
      />
    </div>
  )
}