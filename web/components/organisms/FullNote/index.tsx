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
import { WarnActionModal } from "../../modals/WarnActionModal"

interface props extends Note {
  onUpdateData?: (...args: any) => Promise<any>
}

export function FullNote({
  id,
  title,
  content,
  author,
  privacyStatus,
  createdAt,
  updatedAt,
  noteSlug,
  onUpdateData
}: props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { accessToken, userData } = useContext(AuthContext)
  const router = useRouter()
  const lastUpdate = useMemo(() => {
    try {
      return format(new Date(updatedAt || createdAt), "dd/MM/yyyy - HH:mm", {
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

      if (result?.data?.deletedCount === 1) {
        toast.update(toastId, {
          render: "Nota deletada com sucesso",
          type: "success",
          isLoading: false,
          autoClose: 1500,
          closeOnClick: true,
          closeButton: true,
        });
        return
      }

      if (result.data?.message) {
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
    finally {
      if (onUpdateData) onUpdateData()
    }
  }, [id])

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const initialUpdateDataModal = useMemo(
    () => {
      return {
        id,
        title,
        content,
        author,
        privacyStatus,
        createdAt,
        updatedAt,
        noteSlug,
      }
    },
    [id, title, content, author, privacyStatus, createdAt, updatedAt, noteSlug]
  )

  const onlySpacesStringRegExp = /^\s+$/
  const splitedContent = useMemo(() => {
    return content.split("\n")
  }, [content])

  return (
    <main className={styles.fullNote}>
      {
        accessToken && userData?.id === author?.id ?
          <div className={styles.noteTools}>
            <div className={styles.editNote} onClick={() => openModal()}>
              <AiOutlineEdit size={20} color={"#ffffff"} />
            </div>
            <div className={styles.deleteNote} onClick={() => setIsDeleteModalOpen(true)}>
              <AiOutlineDelete size={20} color={"#ffffff"} />
            </div>
          </div>
          :
          null
      }
      <h1>{title}</h1>
      <p className={styles.author}>
        Escrito por:{" "}
        <Link href={`/app/usuarios/${author?.username}`}>
          <span>{author?.username}</span>
        </Link>
      </p>
      <p className={styles.lastUpdate}>Última atualização - {lastUpdate}</p>

      <div className={styles.divisionLine} />

      <div className={styles.contentBox}>
        {
          splitedContent.map((paragraph) => {
            if (paragraph.length === 0 || onlySpacesStringRegExp.test(paragraph)) {
              return <br />
            }
            return <p className={styles.content}>{paragraph}</p>
          })
        }
      </div>
      {
        accessToken ?
          <>
            <EditNoteModal
              entity={initialUpdateDataModal}
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              onUpdateData={onUpdateData}
            />
            <WarnActionModal
              heading="Deletar nota"
              bodyText="Você perderá a sua nota. Essa ação não pode ser revertida."
              isModalOpen={isDeleteModalOpen}
              closeModal={() => setIsDeleteModalOpen(false)}
              buttonText={"Confirmar"}
              action={async () => await deleteNote()}
              type="dangerous"
              forceAction={false}
            />
          </>
          :
          null
      }
    </main>
  )
}