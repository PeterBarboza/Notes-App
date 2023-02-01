import { useCallback, useEffect, useState, useContext } from "react"

import { NotesServiceFactory } from "../../../../services/factories/notesServiceFactory"
import { AuthContext } from "../../../../contexts/authContext"
import { Feed } from "../../../../components/screens/Feed"

import { Note } from "../../../../interface/schemas"
import { GetManyResponse } from "../../../../services/shared/interface/responses"

const notesService = new NotesServiceFactory().handle()

export async function getServerSideProps(context: any) {
  const sla = {
    search: context?.query?.keyWords || null
  }
  console.log(context)
  return { props: { ...sla } }
}

export default function({ search }: any) {  
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false)
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
    try {
      const result = await notesService.getMany({
        search: search
      })
      setNotes(result)
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
    <Feed 
      isLoadingNotes={isLoadingNotes} 
      notes={notes.results}
    />  
  )
}