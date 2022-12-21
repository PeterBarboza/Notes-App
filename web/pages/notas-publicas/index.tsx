import { useState, useCallback, useEffect } from "react"

import { NotesBoard } from "../../components/organisms/NotesBoard"
import { NotesService } from "../../services/api/notes"

import { Note } from "../../interface"
import { GetManyResponse } from "../../services/api/interface"

const notesService = new NotesService()

export default function() {
  const [notes, setNotes] = useState<GetManyResponse<Note>>()

  const getNotes = useCallback(async () => await notesService.getMany(), [])

  useEffect(() => {
    ;(async () => setNotes(await getNotes()))()
  }, [])

  return (
    <NotesBoard
      notes={notes?.results || []}      
    />
  )
}
