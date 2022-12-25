import { useCallback, useEffect, useState } from "react"

import { NotesBoard } from "../../components/organisms/NotesBoard"
import { NotesService } from "../../services/api/notes"

import { Note } from "../../interface"
import { GetManyResponse } from "../../services/api/interface"

const notesService = new NotesService()

export async function getServerSideProps(context: any) {
  const slugs = {
    username: context.query.username,
  }
  return { props: { ...slugs } }
}

export default function({ username }: any) {
  const [notes, setNotes] = useState<GetManyResponse<Note>>()

  const getNotes = useCallback(async () => await notesService.getManyByAuthor(username), [])

  useEffect(() => {
    ;(async () => setNotes(await getNotes()))()
  }, [])

  return (
    <NotesBoard
      notes={notes?.results || []}
    />
  )
}
