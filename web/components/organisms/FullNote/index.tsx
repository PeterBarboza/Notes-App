import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { useContext, useMemo, useState } from "react"
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai"
import { AuthContext } from "../../../contexts/authContext"

import { Note } from "../../../interface/schemas"
import { EditNoteModal } from "../../modals/EditNoteModal"

import styles from "./styles.module.scss"

export function FullNote({ 
  id, 
  title, 
  content, 
  author, 
  privacyStatus, 
  createdAt, 
  updatedAt, 
  noteSlug
}: Note) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { accessToken, userData } = useContext(AuthContext)
  const lastUpdate = useMemo(() => {
    return format(new Date(updatedAt || createdAt), "dd/MM/yyyy - hh:mm", {
      locale: ptBR,
    })
  }, [updatedAt, createdAt])

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className={styles.fullNote}>
      {
        accessToken && userData?.id === author.id ?
          <div className={styles.noteTools}>
            <div className={styles.editNote} onClick={() => openModal()}>
              <AiOutlineEdit size={20} color={"#ffffff"}/>
            </div>
            <div className={styles.deleteNote}>
              <AiOutlineDelete size={20} color={"#ffffff"}/>
            </div>
          </div>
          :
          null
      }
      <h1>{title}</h1>
      <p className={styles.author}>
        Escrito por: 
        <Link href={`/app/usuarios/${author.username}`}>
          <span>{author.username}</span>
        </Link>
      </p>
      <p className={styles.lastUpdate}>Última atualização - {lastUpdate}</p>
      <p className={styles.content}>
        {content}
      </p>

      {
          accessToken ? 
            <>
              <EditNoteModal
                entity={{
                  id, 
                  title, 
                  content, 
                  author, 
                  privacyStatus, 
                  createdAt, 
                  updatedAt, 
                  noteSlug,
                }}
                isModalOpen={isModalOpen}
                closeModal={closeModal}
              />
            </>
            :
            null
        }
    </main>
  )
}