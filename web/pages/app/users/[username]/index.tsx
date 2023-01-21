import { useState, useContext, useCallback, useEffect } from "react"

import { AuthContext } from "../../../../contexts/authContext"
import { UsersServiceFactory } from "../../../../services/factories/usersServiceFactory"

import { User } from "../../../../interface"

import { UserNotes } from "../../../../components/screens/UserNotes"

export async function getServerSideProps(context: any) {
  const slugs = {
    username: context.query.username,
  }
  return { props: { ...slugs } }
}

const notesService = new UsersServiceFactory().handle()

export default function({ username }: any) {
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false)
  const [userData, setUserData] = useState<User>()
  const { accessToken } = useContext(AuthContext)
  
  const getNotes = useCallback(async () => {
    notesService.accessToken = accessToken
    try {
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
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingNotes(false)
    }
  }, [])

  useEffect(() => {
    setIsLoadingNotes(true)
    getNotes()
  }, [getNotes])

  return (
    <UserNotes userData={userData!} isLoadingNotes={isLoadingNotes} />
  )
}
