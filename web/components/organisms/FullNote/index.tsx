import { format } from "date-fns"
import Link from "next/link"

import { Note } from "../../../interface"

import styles from "./styles.module.scss"

export function FullNote({ 
  id, 
  title, 
  content, 
  author, 
  privacyStatus, 
  createdAt, 
  updatedAt, 
  authorSlug, 
  noteSlug
}: Note) {
  const lastUpdate = format(new Date(updatedAt || createdAt), "dd/MM/yyyy - hh:mm")

  return (
    <main className={styles.fullNote}>
      <h1>{title}</h1>
      <p className={styles.author}>
        Escrito por: <Link href={`/${authorSlug}`}><span>{author}</span></Link>
      </p>
      <p className={styles.lastUpdate}>Última atualização - {lastUpdate}</p>
      <p className={styles.content}>
        {content}
      </p>
    </main>
  )
}