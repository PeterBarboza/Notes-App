import { BsPersonCircle } from "react-icons/bs"

import { NotesBoard } from "../organisms/NotesBoard"
import { BaseLayout } from "../organisms/BaseLayout"
import { Loading } from "../molecules/Loading"

import { Note } from "../../interface/schemas"

import styles from "./userNotes.module.scss"

type props = {
  isLoadingNotes: boolean,
  data: {
    username: string
    notes: Note[] | null
  }
}

export function UserNotes({ isLoadingNotes, data }: props) {  
  return (
    <BaseLayout>
      {
        isLoadingNotes ? 
          <Loading />
        :
          <>
            <div className={styles.userNotesProfileBox}>
              <BsPersonCircle 
                size={40}
                color="#616161"
              />
              <p>{data?.username}</p>
            </div>
              <NotesBoard
                notes={data?.notes}
              />
          </>
      }
    </BaseLayout>
  )
}
