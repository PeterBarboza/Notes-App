import { DetailedHTMLProps, InputHTMLAttributes } from "react"
import styles from "./styles.module.scss"

interface props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  inputDisplayText: string
  isLoading?: boolean
}

export function ModalSubmitInput({
  inputDisplayText,
  isLoading,
  ...inputProps
}: props) {
  return (
    <div className={styles.modalSubmitInput}>
      <input
        {...inputProps}
        type="submit"
        className={`${styles.submitInput} ${inputProps?.disabled || isLoading ? styles.disabledInput : ""}`}
        value={inputDisplayText}
        disabled={inputProps?.disabled || isLoading}
        style={inputProps?.disabled ?
          { cursor: "not-allowed", ...inputProps.style }
          : isLoading ?
            { cursor: "progress", ...inputProps.style }
            :
            { ...inputProps.style }
        }
      />
    </div>
  )
}