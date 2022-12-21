import styles from "./styles.module.scss"

type props = {
  inputId: string
  inputLabel: string
  inputName: string
  exampleText?: string
  required: boolean
  onChange: (value: string) => void
}

export function ModalTextInput({
  inputId,
  inputName,
  inputLabel,
  exampleText,
  required,
  onChange
}: props) {
  return (
    <div className={styles.modalTextInput}>
      <label htmlFor={inputId}>{inputLabel}</label>
      <input
        id={inputId}
        type="text"
        name={inputName}
        className={styles.textInput}
        placeholder={exampleText}
        onChange={(event) => onChange(event.currentTarget.value)}
        required={required}
      />
    </div>
  )
}