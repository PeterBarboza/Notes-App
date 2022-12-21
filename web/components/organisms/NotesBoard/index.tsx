import { SearchBar } from "../../atoms/SearchBar"
import { NoteCard } from "../../molecules/NoteCard"
import { NotesBox } from "../../molecules/NotesBox"

import { Note } from "../../../interface"

import styles from "./styles.module.scss"

type props = {
  notes: Note[]
}

export function NotesBoard({ notes }: props) {
  return (
    <main className={styles.notesBoard}>
      <SearchBar placeholder="Pesquisar por notas públicas" />
      <NotesBox>
        {notes.map(note => {
          return (
            <NoteCard
              key={note.id}
              {...note}
            />
          )
        })}
      </NotesBox>
    </main>
  )
}
