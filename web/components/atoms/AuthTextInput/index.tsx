import { DetailedHTMLProps, InputHTMLAttributes, useEffect } from "react"

import styles from "./styles.module.scss"

type props = {
  inputErrors?: string
  inputId: string
  inputLabel: string
  inputProps: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
}

export function AuthTextInput({
  inputId,
  inputLabel,
  inputErrors,
  inputProps,
}: props) {

  return (
    <div className={styles.formField}>
      <label htmlFor={inputId} className={styles.label}>
        {inputLabel}
        {
          inputProps?.required ?
            <span className={styles.errorsBox}> *</span>
            :
            null
        }
        {
          inputErrors ?
            <span className={styles.errorsBox}>{inputErrors}</span>
            :
            null
        }
      </label>
      <input
        id={inputId}
        className={styles.input}
        {...inputProps}
      />
    </div>
  )
}