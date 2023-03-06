import { useRouter } from "next/router"
import { useEffect } from "react"
import { BsPersonCircle } from "react-icons/bs"

import { NotesBoard } from "../organisms/NotesBoard"
import { BaseLayout } from "../organisms/BaseLayout"
import { Loading } from "../molecules/Loading"
import { NoDataFound } from "../molecules/NoDataFound"

import { Note } from "../../interface/schemas"
import { NotesPagination, paginationParams } from "../../shared/interface"

import styles from "./userNotes.module.scss"

type props = {
  isLoadingNotes: boolean,
  notes: Note[] | null
  username: string
  pagination: NotesPagination | null
  setPagination: (args: paginationParams) => void
  onUpdateData?: () => Promise<any>
}

export function UserNotes({
  isLoadingNotes,
  notes,
  username,
  pagination,
  setPagination,
  onUpdateData
}: props) {
  const router = useRouter()

  return (
    <BaseLayout onUpdateData={onUpdateData} createNoteButtonEnabled={true}>
      {
        isLoadingNotes ?
          <Loading />
          : notes === null ?
            <NoDataFound
              messages={[
                "Nenhuma nota foi encontrada em:",
                router.asPath
              ]}
            />
            :
            <>
              <div className={styles.userNotesProfileBox}>
                <BsPersonCircle
                  size={40}
                  color="#616161"
                />
                <p>{username}</p>
              </div>
              <NotesBoard
                notes={notes}
                pagination={pagination}
                setPagination={setPagination}
              />
            </>
      }
    </BaseLayout>
  )
}
