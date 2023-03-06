import { KeyboardEvent, useCallback, useContext, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import { NotesServiceFactory } from "../../../services/factories/notesServiceFactory"
import { AuthContext } from "../../../contexts/authContext"

import { GetManyResponse } from "../../../services/shared/interface/responses"
import { Note } from "../../../interface/schemas"

import styles from "./styles.module.scss"
import { NOTES_PAGE_SIZE } from "../../../shared/constants"
import { toast } from "react-toastify"
import { RxMagnifyingGlass } from "react-icons/rx"

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
  const [query, setQuery] = useState<string>("")
  const { accessToken } = useContext(AuthContext)
  const router = useRouter()

  const getNotes = useCallback(async (query: string) => {
    notesService.accessToken = accessToken
    setIsLoadingNotes(true)
    setTimeout(async () => {
      try {
        const result = await notesService.getMany({
          filters: {
            search: query
          },
          pagination: {
            limit: NOTES_PAGE_SIZE
          },
          select: ["id", "updatedAt", "noteSlug", "title"]
        })
        setNotes(result.data)
      } catch (error) { }
      finally {
        setIsLoadingNotes(false)
      }
    }, 400)
  }, [notesService, setNotes, setIsLoadingNotes])

  const changeRoute = useCallback(() => {
    if (query.length < 1) {
      toast.info("Digite algo para poder efetuar a pesquisa.", {
        autoClose: 2000,
        closeOnClick: true,
        closeButton: true,
      })
      return
    }

    const toastId = toast.loading("Carregando notas...")

    router.push(`/app/notas-publicas/pesquisa/${query}`)
    router.events.on("routeChangeComplete", () => {
      setIsPreviewVisible(false)
      toast.dismiss(toastId)
    })
    router.events.on("routeChangeError", () => {
      setIsPreviewVisible(false)
      toast.dismiss(toastId)
    })
  }, [query])

  const handleChangeRouteOnKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (
      (event.code === "Enter") ||
      (event.code === "enter") ||
      (event.key === "Enter") ||
      (event.key === "enter")
    ) {
      changeRoute()
    }
  }, [query, changeRoute])

  return (
    <div className={styles.inputAndPreviewWrap}>
      <input
        type="text"
        className={styles.input}
        placeholder="Pesquisar por notas públicas"
        onChange={(event) => {
          setQuery(event?.target?.value)
          if (event.currentTarget.value.length < 1) {
            setIsPreviewVisible(false)
            return
          }
          setIsPreviewVisible(true)

          getNotes(event?.target?.value)
        }}
        onFocus={() => {
          setIsPreviewVisible(true)
        }}
        onBlur={() => {
          setTimeout(() => {
            setIsInputFocused(false)
            setIsPreviewVisible(false)
          }, 100)
        }}
        onKeyDown={(event) => handleChangeRouteOnKeyDown(event)}
      />
      <button className={styles.searchButton}>
        <RxMagnifyingGlass
          size={30}
          color="#ffffff"
          onClick={() => {
            changeRoute()
          }}
        />
      </button>
      {
        isPreviewVisible ?
          <ul className={styles.searchResultsPreview}>
            {
              isLoadingNotes ?
                <div className={styles.loaderBox}>
                  <li>
                    <div className={styles.loader} />
                    <p>Carregando...</p>
                  </li>
                </div>
                : notes?.results?.length > 0 ?
                  <>
                    {
                      notes.results.map((note) => {
                        return (
                          <Link
                            href={`/app/usuarios/${note.author.username}/${note.noteSlug}`}
                            className={styles.linkWrap}
                            key={`note-searchbar-preview-link-${note.id}`}
                          >
                            <li className={styles.listItem}>{`${note.title} - ${note.author.username}`}</li>
                          </Link>
                        )
                      })
                    }
                    {
                      notes?.pagination?.total > NOTES_PAGE_SIZE ?
                        <div
                          className={styles.linkWrap}
                          onClick={() => changeRoute()}
                        >
                          <li className={styles.listItem}>Ver mais ({notes?.pagination?.total - NOTES_PAGE_SIZE}) resultados...</li>
                        </div>
                        :
                        null
                    }
                  </>
                  :
                  <div
                    className={styles.linkWrap}
                  >
                    <li>Nenhuma nota encontrada</li>
                  </div>
            }
          </ul>
          :
          null
      }
    </div>
  )
}