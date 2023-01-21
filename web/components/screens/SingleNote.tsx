import { BaseLayout } from "../organisms/BaseLayout"

import { FullNote } from "../organisms/FullNote"
import { Loading } from "../molecules/Loading"

import { Note } from "../../interface"

type props = {
  isLoadingNote: boolean,
  note: Note
}

export function SingleNote({ isLoadingNote, note }: props) {  
  return (
    <BaseLayout>
      {
        isLoadingNote ?
          <Loading />
        : note ?
          <FullNote
            {...note}
          />
        :
        null
      }
    </BaseLayout>
  )
}
