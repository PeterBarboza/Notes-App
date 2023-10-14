import { useCallback, useEffect, useState, useContext } from "react"

import { NotesBoard } from "../../components/organisms/NotesBoard"
import { NotesServiceFactory } from "../../services/factories/notesServiceFactory"
import { AuthContext } from "../../contexts/authContext"

import { Note } from "../../interface"
import { GetManyResponse } from "../../services/shared/interface"

const notesService = new NotesServiceFactory().handle()

export default function() {  
  const [notes, setNotes] = useState<GetManyResponse<Note>>({
    pagination: {
      total: 0,
      limit: 10,
      skip: 0
    },
    results: []
  })
  const { accessToken } = useContext(AuthContext)
  
  const getNotes = useCallback(async () => {
    notesService.accessToken = accessToken
    const result = await notesService.getMany({})
    setNotes(result)
  }, [])

  useEffect(() => {
    getNotes()
  }, [getNotes])

  return (
    <NotesBoard
      notes={notes.results}      
    />
  )
}
