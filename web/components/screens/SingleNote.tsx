import { useRouter } from "next/router"

import { BaseLayout } from "../organisms/BaseLayout"
import { FullNote } from "../organisms/FullNote"
import { Loading } from "../molecules/Loading"
import { NoDataFound } from "../molecules/NoDataFound"

import { Note } from "../../interface/schemas"

type props = {
  isLoadingNote: boolean,
  note: Note
  onUpdateData?: (...args: any) => Promise<any>
}

export function SingleNote({ isLoadingNote, note, onUpdateData }: props) {  
  const router = useRouter()

  return (
    <BaseLayout createNoteButtonEnabled={true}>
      {
        isLoadingNote ?
          <Loading />
        : note === null ?
          <NoDataFound 
            messages={[
              "Nenhuma nota foi encontrada em:",
              router.asPath
            ]}
          />
          :
          <FullNote
            {...note}
            onUpdateData={onUpdateData}
          />
      }
    </BaseLayout>
  )
}
