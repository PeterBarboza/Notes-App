import styles from "./styles.module.scss"

type props = {
  inputId: string
  inputLabel: string
  inputName: string
  exampleText?: string
  required: boolean,
  onChange: (value: string) => void
}

export function ModalTextArea({
  inputId,
  inputName,
  inputLabel,
  exampleText,
  required,
  onChange
}: props) {
  return (
    <div className={styles.modalTextArea}>
      <label htmlFor={inputId}>{inputLabel}</label>
      <textarea
        id={inputId}
        name={inputName}
        className={styles.textArea}
        placeholder={exampleText}
        onChange={(event) => onChange(event.currentTarget.value)}
        required={required}
      />
    </div>
  )
}