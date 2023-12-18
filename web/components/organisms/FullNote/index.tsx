import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai"
import { toast } from "react-toastify"

import { AuthContext } from "../../../contexts/authContext"
import { NotesServiceFactory } from "../../../services/factories/notesServiceFactory"
import { EditNoteModal } from "../../modals/EditNoteModal"

import { Note } from "../../../interface/schemas"

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
  const router = useRouter()
  const lastUpdate = useMemo(() => {
    try {
      return format(new Date(updatedAt || createdAt), "dd/MM/yyyy - hh:mm", {
        locale: ptBR,
      })
    } catch (error) {
      return "indisponível"      
    }
  }, [updatedAt, createdAt])

  const deleteNote = useCallback(async () => {
    const toastId = toast.loading("Deletando nota...")

    try {
      const notesService = new NotesServiceFactory().handle()
  
      notesService.accessToken = accessToken

      const result: any = await notesService.delete(id)

       if(result?.data?.deletedCount === 1) {
        toast.update(toastId, { 
          render: "Nota deletada com sucesso", 
          type: "success", 
          isLoading: false,
          autoClose: 1500,
          closeOnClick: true,
          closeButton: true,
        });

        setTimeout(() => router.push(`/app/usuarios/${author.username}`), 1500)
        
        return
      }
      
      if(result.data?.message) {
        toast.update(toastId, { 
          render: result.data?.message, 
          type: "error", 
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
          closeButton: true,
        })
        return
      }

      toast.update(toastId, { 
        render: "Erro ao deletar nota", 
        type: "error", 
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
    } catch (error) {
       toast.update(toastId, { 
        render: "Erro ao deletar nota", 
        type: "error", 
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
    }
  }, [id])

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    // console.log(window.history)
  }, [])

  return (
    <main className={styles.fullNote}>
      {
        accessToken && userData?.id === author?.id ?
          <div className={styles.noteTools}>
            <div className={styles.editNote} onClick={() => openModal()}>
              <AiOutlineEdit size={20} color={"#ffffff"}/>
            </div>
            <div className={styles.deleteNote} onClick={() => deleteNote()}>
              <AiOutlineDelete size={20} color={"#ffffff"}/>
            </div>
          </div>
          :
          null
      }
      <h1>{title}</h1>
      <p className={styles.author}>
        Escrito por: 
        <Link href={`/app/usuarios/${author?.username}`}>
          <span>{author?.username}</span>
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