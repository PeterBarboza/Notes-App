import { NotesBoard } from "../organisms/NotesBoard"
import { BaseLayout } from "../organisms/BaseLayout"
import { Loading } from "../molecules/Loading"

import { Note } from "../../interface/schemas"

type props = {
  isLoadingNotes: boolean,
  notes: Note[] | null
}

export function Feed({ isLoadingNotes, notes }: props) {  
  return (
    <BaseLayout>
      {
        isLoadingNotes ? 
          <Loading />
        :
        //IF notes === null ? 
          //<Renderizar componente de "dados não encontrados"> 
          //:
          //<Renderizar "Notesboard" normalmente>
          <NotesBoard
            notes={notes}      
          />
      }
    </BaseLayout>
  )
}
