import { useState, useCallback, useEffect } from "react"

import { FullNote } from "../../../components/organisms/FullNote"
import { NotesService } from "../../../services/api/notes"

import { Note } from "../../../interface"
import { GetOneResponse } from "../../../services/api/interface"
import { useRouter } from "next/router"


const notesService = new NotesService()

export async function getServerSideProps(context: any) {
  const slugs = {
    username: context.query.username,
    noteSlug: context.query.noteSlug
  }
  return { props: { ...slugs } }
}

export default function({ username, noteSlug }: any) {
  const [note, setNote] = useState<GetOneResponse<Note>>()

  const getNote = useCallback(async () => {
    const note = await notesService.getOne({ noteSlug, username })

    setNote(note)
  }, [])

  useEffect(() => {
    getNote()
  }, [])

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
