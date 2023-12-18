import { useCallback, useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"

import { NotesServiceFactory } from "../../../../../services/factories/notesServiceFactory"

import { Note } from "../../../../../interface/schemas"
import { GetOneResponse } from "../../../../../services/shared/interface/responses"
import { AuthContext } from "../../../../../contexts/authContext"
import { SingleNote } from "../../../../../components/screens/SingleNote"
import { withRefreshTokenAuth } from "../../../../../services/shared/decorators/withRefreshTokenAuth"

export async function getServerSideProps(context: any) {
  const slugs = {
    username: context?.query?.username || null,
    noteSlug: context?.query?.noteSlug || null
  }
  return { props: { ...slugs } }
}

const notesService = new NotesServiceFactory().handle()

export default function({ username, noteSlug }: any) {
  const [isLoadingNote, setIsLoadingNote] = useState<boolean>(false)
  const [note, setNote] = useState<GetOneResponse<Note>>()
  const { accessToken, setAuthContextData } = useContext(AuthContext)
  const router = useRouter()

  const getNote = useCallback(async () => {
    notesService.accessToken = accessToken
    try {
      setIsLoadingNote(true)
      
      const result = await withRefreshTokenAuth(
        notesService.getOne, 
        { 
          setAuthContextData: setAuthContextData!,
          routerInstance: router 
        }, 
        { optional: true, thisArg: notesService }
      )([noteSlug])
      if(result?.data) setNote(result.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingNote(false)
    }
  }, [noteSlug, setIsLoadingNote, router])

  useEffect(() => {
    getNote()
  }, [getNote])

  return (
    <SingleNote isLoadingNote={isLoadingNote} note={note!} />
  )
}
