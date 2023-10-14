import { useState, useContext, useCallback, useEffect } from "react"
import { BsPersonCircle } from "react-icons/bs"

import { NotesBoard } from "../../components/organisms/NotesBoard"
import { AuthContext } from "../../contexts/authContext"
import { UsersServiceFactory } from "../../services/factories/usersServiceFactory"

import { User } from "../../interface"

import styles from "../../styles/userNotes.module.scss"

export async function getServerSideProps(context: any) {
  const slugs = {
    username: context.query.username,
  }
  return { props: { ...slugs } }
}

const notesService = new UsersServiceFactory().handle()

export default function({ username }: any) {
  const [userData, setUserData] = useState<User>()
  const { accessToken } = useContext(AuthContext)
  
  const getNotes = useCallback(async () => {
    notesService.accessToken = accessToken
    const result = await notesService.getOneWithNotes(username)

    result.notes = result.notes.map((note) => {
      return {
        ...note,
        author: {
          ...result!,
          notes: []
        }
      }
    })

    setUserData(result)
  }, [])

  useEffect(() => {
    getNotes()
  }, [getNotes])

  return (
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
  )
}
