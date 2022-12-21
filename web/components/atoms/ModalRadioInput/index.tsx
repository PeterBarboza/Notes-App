import styles from "./styles.module.scss"

type input = {
  id: string
  label: string
  value: string
}

type props = {
  inputs: input[]
  inputName: string
  inputDisplayName: string
  required: boolean
  onChange: (value: string) => void
}

export function ModalRadioInput({
  inputs, 
  inputName,
  inputDisplayName, 
  required,
  onChange
  }: props) {
  return (
    <div className={styles.modalRadioInput}>
      <div className={styles.inputDisplayName}>{inputDisplayName}</div>
      {inputs.map((input) => {
        return (
          <div className={styles.inputBox} key={input.id}>
            <input
              type="radio"
              id={input.id}
              name={inputName}
              value={input.value}
              className={styles.radioInput}
              onChange={(event) => onChange(event.currentTarget.value)}
              required={required}
            />
            <label htmlFor={input.id}>{input.label}</label>
          </div>
        )
      })}
    </div>
  )
}