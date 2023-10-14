import { useCallback, useEffect, useState, useContext } from "react"

import { FullNote } from "../../../components/organisms/FullNote"
import { NotesServiceFactory } from "../../../services/factories/notesServiceFactory"

import { Note } from "../../../interface"
import { GetOneResponse } from "../../../services/shared/interface"
import { AuthContext } from "../../../contexts/authContext"

export async function getServerSideProps(context: any) {
  const slugs = {
    username: context?.query?.username || null,
    noteSlug: context?.query?.noteSlug || null
  }
  return { props: { ...slugs } }
}

const notesService = new NotesServiceFactory().handle()

export default function({ username, noteSlug }: any) {
  const [note, setNote] = useState<GetOneResponse<Note>>()
  const { accessToken } = useContext(AuthContext)
  
  const getNotes = useCallback(async () => {
    notesService.accessToken = accessToken
    const result = await notesService.getOne(noteSlug)
    setNote(result)
  }, [])

  useEffect(() => {
    getNotes()
  }, [getNotes])

  return (
    <>
      {
        note && 
          <FullNote
            {...note}
          />
      }
    </>
  )
}
