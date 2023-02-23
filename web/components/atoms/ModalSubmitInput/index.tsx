import styles from "./styles.module.scss"

type props = {
  inputDisplayText: string
  isLoading?: boolean
}

export function ModalSubmitInput({
  inputDisplayText,
  isLoading
}: props) {
  return (
    <div className={styles.modalSubmitInput}>
      <input
        type="submit"
        className={`${styles.submitInput} ${isLoading ? styles.disabledInput : ""}`}
        value={inputDisplayText}
        disabled={isLoading}
      />
    </div>
  )
}