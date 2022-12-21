import Link from "next/link"

import styles from "./styles.module.scss"

export function Header() {
  return (
    <header className={styles.header}>
      <Link href="/minhas-notas" className={styles.linkWrap}>
        <div className={styles.linkButton}>
          Minhas notas
        </div>
      </Link>
      <Link href="/notas-publicas">
        <div className={styles.linkButton}>
          Notas públicas
        </div>
      </Link>
    </header>
  )
}