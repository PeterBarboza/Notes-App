import { useState, useContext, useCallback, useEffect } from "react"
import { useRouter } from "next/router"

import { AuthContext } from "../../../../contexts/authContext"
import { UserNotes } from "../../../../components/screens/UserNotes"
import { withRefreshTokenAuth } from "../../../../services/shared/decorators/withRefreshTokenAuth"
import { NotesServiceFactory } from "../../../../services/factories/notesServiceFactory"

import { Note, User } from "../../../../interface/schemas"

export async function getServerSideProps(context: any) {
  const slugs = {
    username: context.query.username,
  }
  return { props: { ...slugs } }
}

type userData = {
  username: string
  notes: Note[] | null
}

export default function({ username }: any) {
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false)
  const [userData, setUserData] = useState<userData>({ username: username, notes: null })
  const { accessToken, setAuthContextData } = useContext(AuthContext)
  const router = useRouter()  

  const getNotes = useCallback(async () => {
    const notesService = new NotesServiceFactory().handle()
    
    notesService.accessToken = accessToken
    try {  
      setIsLoadingNotes(true)
      
      const result = await withRefreshTokenAuth(
        notesService.getMany.bind(notesService),
        { 
          setAuthContextData: setAuthContextData!,
          routerInstance: router 
        }, 
        { optional: true }
      )([{ filters: { author: { username: username } } }])

      if(result?.data) {
        const notes = result.data.results.length < 1 ? 
          null
          :
          result.data.results.map((note) => {
            return {
              ...note,
              author: {
                username: username
              }
            }
          }) as Note[]
        
        setUserData({ username: username, notes: notes })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingNotes(false)
    }
  }, [
    setIsLoadingNotes, 
    setAuthContextData, 
    setUserData, 
    accessToken, 
    router
  ])

  useEffect(() => {
    getNotes()
  }, [getNotes])

  return (
    <UserNotes 
      data={{ username: userData?.username!, notes: userData?.notes }} 
      isLoadingNotes={isLoadingNotes} 
    />
  )
}
