import { useCallback, useEffect, useState } from "react"

import { NotesBoard } from "../../components/organisms/NotesBoard"
import { NotesService } from "../../services/api/notes"

import { Note } from "../../interface"
import { GetManyResponse } from "../../services/api/interface"
import { SearchBar } from "../../components/atoms/SearchBar"

const notesService = new NotesService()

export async function getServerSideProps(context: any) {
  const slugs = {
    authorSlug: context.query.authorSlug,
  }
  return { props: { ...slugs } }
}

export default function({ authorSlug }: any) {
  const [notes, setNotes] = useState<GetManyResponse<Note>>()

  const getNotes = useCallback(async () => await notesService.getManyByAuthor(authorSlug), [])

  useEffect(() => {
    ;(async () => setNotes(await getNotes()))()
  }, [])

  return (
    <>
      <NotesBoard
        notes={notes?.results || []}
      />
    </>
  )
}
