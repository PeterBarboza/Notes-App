import styles from "./styles.module.scss"

type props = {
  actualValue: string
  inputId: string
  inputLabel: string
  inputName: string
  exampleText?: string
  required: boolean
  onChange: (value: string) => void
}

export function ModalTextInput({
  actualValue,
  inputId,
  inputName,
  inputLabel,
  exampleText,
  required,
  onChange
}: props) {
  return (
    <div className={styles.modalTextInput}>
      <label htmlFor={inputId}>
        {inputLabel}
        {
          required ?
            <span style={{ color: "#ff3e3e" }}> *</span>
            :
            null
        }
      </label>
      <input
        id={inputId}
        type="text"
        name={inputName}
        className={styles.textInput}
        placeholder={exampleText}
        onChange={(event) => {
          onChange(event.currentTarget.value)
        }}
        value={actualValue}
        required={required}
      />
    </div>
  )
}