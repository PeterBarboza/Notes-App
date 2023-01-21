import { NotesBoard } from "../organisms/NotesBoard"
import { BaseLayout } from "../organisms/BaseLayout"
import { Loading } from "../molecules/Loading"

import { Note } from "../../interface"

type props = {
  isLoadingNotes: boolean,
  notes: Note[]
}

export function Feed({ isLoadingNotes, notes }: props) {  
  return (
    <BaseLayout>
      {
        isLoadingNotes ? 
          <Loading />
        :
          <NotesBoard
            notes={notes}      
          />
      }
    </BaseLayout>
  )
}
