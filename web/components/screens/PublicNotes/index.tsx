import { useContext, useMemo } from "react"
import { useRouter } from "next/router"

import { NotesBoard } from "../../organisms/NotesBoard"
import { BaseLayout } from "../../organisms/BaseLayout"
import { Loading } from "../../molecules/Loading"
import { NoDataFound } from "../../molecules/NoDataFound"
import { AuthContext } from "../../../contexts/authContext"

import { Note } from "../../../interface/schemas"
import { NotesPagination, paginationParams } from "../../../shared/interface"

type props = {
  isLoadingNotes: boolean,
  notes: Note[] | null
  pagination: NotesPagination | null
  setPagination: (args: paginationParams) => void
  onUpdateData?: () => Promise<any>
}

export function PublicNotes({ 
  isLoadingNotes, 
  notes, 
  pagination, 
  setPagination, 
  onUpdateData 
}: props) {  
  const { accessToken } = useContext(AuthContext)

  const loggedInUserNotesNotFoundMessage = useMemo(() => [
    "Nenhuma nota pública foi encontrada no momento.",
    "Que tal criar a sua? Basta clicar no ícone de caneta",
    "no canto inferior direito da tela e começar a escrever.",
  ], [])
  const nonLoggedInUserNotesNotFoundMessage = useMemo(() => [
    "Nenhuma nota pública foi encontrada no momento.",
    "Que tal criar a sua? Basta conectar-se a sua conta ou",
    "criar uma nova para ter acesso a essa funcionalidade.",
    "Clique no avatar no cabeçalho da página e em seguida",
    "clique em \"Fazer login\"."
  ], [])

  return (
    <BaseLayout onUpdateData={onUpdateData} createNoteButtonEnabled={true}>
      {
        isLoadingNotes ? 
          <Loading />
        : notes === null ?
          <NoDataFound 
              messages={
                accessToken ? 
                  loggedInUserNotesNotFoundMessage
                  : 
                  nonLoggedInUserNotesNotFoundMessage
              }
            />
          : 
            <NotesBoard
              notes={notes}
              pagination={pagination}  
              setPagination={setPagination}
            />
      }
    </BaseLayout>
  )
}
