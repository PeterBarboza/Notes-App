import styles from "./styles.module.scss"

type props = {
  substituteMessage?: string
}

export function Loading({ substituteMessage }: props) {
  return (
    <div className={styles.loadingBox}>
      <div className={styles.circle} />
      <p>{substituteMessage ? substituteMessage : "Carregando..."}</p>
    </div>
  )
}