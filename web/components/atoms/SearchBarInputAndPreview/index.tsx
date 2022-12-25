import Link from "next/link"
import { useState, useCallback, LegacyRef } from "react"

import { NotesService } from "../../../services/api/notes"

import { Note } from "../../../interface"

import styles from "./styles.module.scss"

const notesService = new NotesService()

interface props extends Partial<HTMLInputElement> {
  setIsInputFocused: (value: boolean) => void
}

export function SearchBarInputAndPreview({
  setIsInputFocused
}: props) {
  const [notes, setNotes] = useState<Note[]>([])
  const [inputValue, setInputValue] = useState<string>("")
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
    <div className={styles.inputAndPreviewWrap}>
      <input 
        type="text"
        className={styles.input}
        placeholder="Pesquisar por notas públicas"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.currentTarget.value)
          search(event.currentTarget.value)
        }}
        onBlur={() => {
          setTimeout(() => {
            setIsInputFocused(false)
          }, 100)
        }}
      />
      {
        notes.length > 0 && (
          <ul className={styles.searchResultsPreview}>
            {
              notes.map((note) => {
                return (
                  <Link 
                    href={`/${note.author.username}/${note.noteSlug}`}
                    className={styles.liLinkWrap}
                    key={`note-searchbar-preview-link-${note.id}`}
                  >
                    <li>{`${note.title} - ${note.author}`}</li>
                  </Link>
                )
              })
            }
          </ul>
        )
      }
    </div>
  )
}