import styles from "./styles.module.scss"

type props = {
  message: string
}

export function InputErrorMessage({ message }: props) {
  return (
    <span className={styles.inputErrorMessage}>
      * {message}
    </span>
  )
}