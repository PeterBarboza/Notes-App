import { useRouter } from "next/router"

import { NotesBoard } from "../organisms/NotesBoard"
import { BaseLayout } from "../organisms/BaseLayout"
import { Loading } from "../molecules/Loading"

import { Note } from "../../interface/schemas"
import { NotesPagination, paginationParams } from "../../shared/interface"
import { NoDataFound } from "../molecules/NoDataFound"

type props = {
  isLoadingNotes: boolean,
  notes: Note[] | null
  pagination: NotesPagination | null
  setPagination: (args: paginationParams) => void
  onUpdateData?: () => Promise<any>
}

export function Feed({ 
  isLoadingNotes, 
  notes, 
  pagination, 
  setPagination, 
  onUpdateData 
}: props) {  
  const router = useRouter()

  return (
    <BaseLayout onUpdateData={onUpdateData}>
      {
        isLoadingNotes ? 
          <Loading />
        : notes === null ?
          <NoDataFound 
            messages={[
              "Nenhuma nota foi encontrada em:",
              router.asPath
            ]}
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
