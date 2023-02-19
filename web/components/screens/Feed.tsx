import { NotesBoard } from "../organisms/NotesBoard"
import { BaseLayout } from "../organisms/BaseLayout"
import { Loading } from "../molecules/Loading"

import { Note } from "../../interface/schemas"
import { NotesPagination, paginationParams } from "../../shared/interface"

type props = {
  isLoadingNotes: boolean,
  notes: Note[] | null
  pagination: NotesPagination | null
  setPagination: (args: paginationParams) => void
}

export function Feed({ isLoadingNotes, notes, pagination, setPagination }: props) {  
  return (
    <BaseLayout>
      {
        isLoadingNotes ? 
          <Loading />
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
