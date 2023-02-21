import { BsPersonCircle } from "react-icons/bs"

import { NotesBoard } from "../organisms/NotesBoard"
import { BaseLayout } from "../organisms/BaseLayout"
import { Loading } from "../molecules/Loading"

import { Note } from "../../interface/schemas"
import { NotesPagination, paginationParams } from "../../shared/interface"

import styles from "./userNotes.module.scss"

type props = {
  isLoadingNotes: boolean,
  notes: Note[] | null
  username: string
  pagination: NotesPagination | null
  setPagination: (args: paginationParams) => void
}

export function UserNotes({ isLoadingNotes, notes, username, pagination, setPagination }: props) {  
  return (
    <BaseLayout>
      {
        isLoadingNotes ? 
          <Loading />
        :
          <>
            {
              notes === null ?
                null
                :
                <div className={styles.userNotesProfileBox}>
                  <BsPersonCircle 
                    size={40}
                    color="#616161"
                  />
                  <p>{username}</p>
                </div>
            }
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
