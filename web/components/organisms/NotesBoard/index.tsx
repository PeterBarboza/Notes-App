import { BiBlock } from "react-icons/bi"

import { NoteCard } from "../../molecules/NoteCard"
import { NotesBox } from "../../molecules/NotesBox"

import { Note } from "../../../interface/schemas"

import styles from "./styles.module.scss"
import { useRouter } from "next/router"

type props = {
  notes: Note[] | null
}

export function NotesBoard({ notes }: props) {
  const router = useRouter()

  return (
    <main className={styles.notesBoard}>
      {
        notes === null?
          <div className={styles.noNotesFound}>
            <BiBlock size={80} color="#9b9b9b"/>
            <div>
              <p>Nenhuma nota foi encontrada em:</p>
              <p>{router.asPath}</p>
            </div>
          </div>
          :
          <NotesBox>
            {
              notes.map(note => {
                return (
                  <NoteCard
                    key={note.id}
                    {...note}
                  />
                )
              })
            }
          </NotesBox>
      }
    </main>
  )
}
