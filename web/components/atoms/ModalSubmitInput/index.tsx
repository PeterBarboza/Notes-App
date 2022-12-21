import styles from "./styles.module.scss"

type props = {
  inputDisplayText: string
}

export function ModalSubmitInput({
  inputDisplayText
}: props) {
  return (
    <div className={styles.modalSubmitInput}>
      <input
        type="submit"
        className={styles.submitInput}
        value={inputDisplayText}
      />
    </div>
  )
}