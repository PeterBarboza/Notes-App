import { KeyboardEvent, useCallback, useContext, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import { NotesServiceFactory } from "../../../services/factories/notesServiceFactory"
import { AuthContext } from "../../../contexts/authContext"

import { GetManyResponse } from "../../../services/shared/interface/responses"
import { Note } from "../../../interface/schemas"

import styles from "./styles.module.scss"

interface props extends Partial<HTMLInputElement> {
  setIsInputFocused: (value: boolean) => void
}

const notesService = new NotesServiceFactory().handle()

export function SearchBarInputAndPreview({
  setIsInputFocused,
}: props) {
  const [notes, setNotes] = useState<GetManyResponse<Note>>({
    pagination: {
      total: 0,
      limit: 10,
      skip: 0
    },
    results: []
  })
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false)
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false)
  const { accessToken } = useContext(AuthContext)
  const router = useRouter()

  const getNotes = useCallback(async (searchWords: string) => {
    notesService.accessToken = accessToken
    setTimeout(async () => {
      try {
        const result = await notesService.getMany({
          search: searchWords
        })
        setNotes(result)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingNotes(false)
      }
    }, 100)
  }, [])

  const handleSearchResultRoute = useCallback((event: any) => {
    if(
      (event.code === "Enter") ||
      (event.code === "enter") ||
      (event.key === "Enter") ||
      (event.key === "enter")
    ) {
      if(event.currentTarget.value.length >= 1) {
        router.push(`/app/notas-publicas/pesquisa/${event.target.value}`)
      }
    }
  }, [])

  return (
    <div className={styles.inputAndPreviewWrap}>
      <input 
        type="text"
        className={styles.input}
        placeholder="Pesquisar por notas públicas"
        onChange={(event) => {
          if(event.currentTarget.value.length < 1) {
            setIsPreviewVisible(false)
            return
          }
          setIsPreviewVisible(true)

          setIsLoadingNotes(true)
          getNotes(event.currentTarget.value)
        }}
        onBlur={() => {
          setTimeout(() => {
            setIsInputFocused(false)
            setIsPreviewVisible(false)
          }, 100)
        }}
        onKeyDown={(event) => handleSearchResultRoute(event)}
      />
      {
        isPreviewVisible ? 
          <ul className={styles.searchResultsPreview}>
            {
              isLoadingNotes ?
                <div className={styles.loaderBox}>
                  <li>
                    <div className={styles.loader}/>
                    <p>Carregando...</p>
                  </li>
                </div>
              : notes.results.length > 0 ?
                  notes.results.map((note) => {
                    return (
                      <Link 
                        href={`/app/usuarios/${note.author.username}/${note.noteSlug}`}
                        className={styles.linkWrap}
                        key={`note-searchbar-preview-link-${note.id}`}
                      >
                        <li>{`${note.title} - ${note.author.username}`}</li>
                      </Link>
                    )
                  })
                :                  
                  (() => {setIsPreviewVisible(false); return null})()
            }
          </ul>
          :
          null
      }
    </div>
  )
}