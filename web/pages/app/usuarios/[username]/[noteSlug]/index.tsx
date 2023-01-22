import { useCallback, useEffect, useState, useContext } from "react"

import { FullNote } from "../../../../../components/organisms/FullNote"
import { NotesServiceFactory } from "../../../../../services/factories/notesServiceFactory"

import { Note } from "../../../../../interface/schemas"
import { GetOneResponse } from "../../../../../services/shared/interface/responses"
import { AuthContext } from "../../../../../contexts/authContext"
import { SingleNote } from "../../../../../components/screens/SingleNote"

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
  const { accessToken } = useContext(AuthContext)
  
  const getNotes = useCallback(async () => {
    notesService.accessToken = accessToken
    try {
      const result = await notesService.getOne(noteSlug)
      setNote(result)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingNote(false)
    }
  }, [])

  useEffect(() => {
    setIsLoadingNote(true)
    getNotes()
  }, [getNotes])

  return (
    <SingleNote isLoadingNote={isLoadingNote} note={note!} />
  )
}
