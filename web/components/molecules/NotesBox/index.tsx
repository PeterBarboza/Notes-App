import { ReactNode } from "react"

import styles from "./styles.module.scss"

type props = {
  children: ReactNode
}

export function NotesBox({ children }: props) {
  return (
    <div className={styles.notesBox}>
      {children}
    </div>
  )
}