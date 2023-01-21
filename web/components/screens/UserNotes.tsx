import { BsPersonCircle } from "react-icons/bs"

import { NotesBoard } from "../organisms/NotesBoard"
import { BaseLayout } from "../organisms/BaseLayout"
import { Loading } from "../molecules/Loading"

import { User } from "../../interface"

import styles from "./userNotes.module.scss"

type props = {
  isLoadingNotes: boolean,
  userData: User
}

export function UserNotes({ isLoadingNotes, userData }: props) {  
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
              <p>{userData?.username}</p>
            </div>
              <NotesBoard
                notes={userData?.notes || []}
              />
          </>
      }
    </BaseLayout>
  )
}
