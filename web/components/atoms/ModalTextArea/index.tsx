import styles from "./styles.module.scss"

type props = {
  actualValue: string
  inputId: string
  inputLabel: string
  inputName: string
  exampleText?: string
  required: boolean,
  onChange: (value: string) => void
}

export function ModalTextArea({
  actualValue,
  inputId,
  inputName,
  inputLabel,
  exampleText,
  required,
  onChange
}: props) {
  return (
    <div className={styles.modalTextArea}>
      <label htmlFor={inputId}>
        {inputLabel}
        {
          required ?
            <span style={{ color: "#ff3e3e" }}> *</span>
            :
            null
        }
      </label>
      <textarea
        id={inputId}
        name={inputName}
        className={styles.textArea}
        placeholder={exampleText}
        onChange={(event) => onChange(event.currentTarget.value)}
        value={actualValue}
        required={required}
      />
    </div>
  )
}