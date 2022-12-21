import { useCallback, useState } from "react"
import Link from "next/link"

import { NotesService } from "../../../services/api/notes"

import { Note } from "../../../interface"

import styles from "./styles.module.scss"

const notesService = new NotesService()

type props = {
  placeholder: string
}

export function SearchBar({ placeholder }: props) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isFocused, setIsFocused] = useState(false)

  const search = useCallback(async (searchInputValue: string) => {
    const result = await notesService.search({
      keyWords: searchInputValue,
      paginationParams: {
        limit: 999,
        skip: 999
      }
    })

    setNotes(result.results)
  }, [])

  return (
    <div className={styles.searchBarBox}>
      <form className={styles.form}>
        <input 
          type="text"
          className={styles.searchBarInput}
          placeholder={placeholder}
          onChange={async (event) => {
            await search(event.currentTarget.value)
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsFocused(false)
            }, 100)
          }}
        />
        <input type="submit" className={styles.searchBarSubmit} value="Pesquisar" />
        {
          isFocused && notes.length > 0 ? (
            <ul className={styles.searchResultsPreview}>
              {
                notes.map((note) => {
                  return (
                    <Link href={`/${note.authorSlug}/${note.noteSlug}`}>
                      <li 
                        key={`search-results-list-note-${note.id}`}
                      >
                        {note.title} - {note.author}
                      </li>
                    </Link>
                  )
                })
              }
            </ul>
          )
          :
          null
        }
      </form>
    </div>
  )
}