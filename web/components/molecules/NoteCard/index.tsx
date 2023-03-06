import Link from "next/link"
import { useCallback, useMemo } from "react"
import { BiWorld, BiNote } from "react-icons/bi"
import { FaLock } from "react-icons/fa"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Note } from "../../../interface/schemas"

import styles from "./styles.module.scss"

export function NoteCard({
  id,
  title,
  content,
  author,
  privacyStatus,
  createdAt,
  updatedAt,
  noteSlug
}: Note) {
  const lastUpdate = useMemo(() => {
    try {
      return format(new Date(updatedAt || createdAt), "dd/MM/yyyy - HH:mm", {
        locale: ptBR,
      })
    } catch (error) {
      return updatedAt || createdAt || "Indisponível"
    }
  }, [updatedAt, createdAt])

  const PrivacyIcon = useCallback((status: string) => {
    switch (status) {
      case "public":
        return <BiWorld size={20} />

      case "private":
        return <FaLock size={15} />

      default:
        return <BiNote size={20} />
    }
  }, [])

  const splitedContent = useMemo(() => {
    return content.split("\n")
  }, [content])

  return (
    <Link href={`/app/usuarios/${author.username}/${noteSlug}`} className={styles.linkWrap}>
      <article className={styles.noteCard} title={`${title} - ${author.username}`}>
        <div className={styles.cardHeading}>
          <div className={styles.iconBox}>
            {PrivacyIcon(privacyStatus)}
          </div>
          <h2>{title}</h2>
        </div>

        <p className={styles.author}>{author.username}</p>

        <p className={styles.lastUpdate}>Última atualização | {lastUpdate}</p>

        {
          splitedContent.map((paragraph) => {
            return <p className={styles.content}>{paragraph}</p>
          })
        }

        <div className={styles.readMore}>
        </div>
        <span className={styles.overflowShadow} />
      </article>
    </Link>
  )
}