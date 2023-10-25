import { Loading } from "../../molecules/Loading"

import styles from "./styles.module.scss"

export function Redirecting() {
  return (
    <div className={styles.redirecting}>
      <Loading substituteMessage="Redirecionando..." />
    </div>
  )
}