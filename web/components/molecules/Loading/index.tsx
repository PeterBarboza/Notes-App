import styles from "./styles.module.scss"

export function Loading() {
  return (
    <div className={styles.loadingBox}>
      <div className={styles.circle} />
      <p>Carregando...</p>
    </div>
  )
}