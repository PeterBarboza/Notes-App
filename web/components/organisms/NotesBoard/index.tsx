import { useCallback, useMemo } from "react"
import { useRouter } from "next/router"
import { BiBlock } from "react-icons/bi"

import { NoteCard } from "../../molecules/NoteCard"
import { NotesBox } from "../../molecules/NotesBox"

import { Note } from "../../../interface/schemas"
import { NotesPagination, page, paginationParams } from "../../../shared/interface"

import styles from "./styles.module.scss"

type props = {
  notes: Note[] | null
  pagination?: NotesPagination | null
  setPagination: (args: paginationParams) => void
}

export function NotesBoard({ notes, pagination = null, setPagination }: props) {
  const router = useRouter()

  const currentAmmount = useMemo(() => {
    const currentAmmount = pagination?.pagesList
      .find(page => page.pageNumber === pagination.currentPage)
      ?.currentAmmount

    if(currentAmmount?.constructor !== Number || isNaN(currentAmmount)) {
      return null
    }

    return currentAmmount
  }, [pagination])

  const generateList = useCallback(() => {
    if (!pagination) return null

    if(pagination.pagesList.length <= 5) {
      return pagination.pagesList.map((item) => {
        return (
          <li 
            className={`
              ${styles.listItem} 
              ${item.pageNumber === pagination.currentPage ? styles.activeListItem : ""}
            `}
            onClick={() => {changePage(item)}}
          >
            {item.pageNumber}
          </li>
        )
      })
    }
    
    const firstPart = pagination.pagesList.slice(0, 2)
    const lastPart = pagination.pagesList.slice(-2)

    return (
      <>
        {
          firstPart.map((item) => {
            return (
              <li 
                className={`
                  ${styles.listItem} 
                  ${item.pageNumber === pagination.currentPage ? styles.activeListItem : ""}
                `}
                onClick={() => {changePage(item)}}
              >
                {item.pageNumber}
              </li>
            )
          })
        }
        <li className={styles.listItem}>...</li>
        {
          lastPart.map((item) => {
            return (
              <li 
                className={`
                  ${styles.listItem} 
                  ${item.pageNumber === pagination.currentPage ? styles.activeListItem : ""}
                `}
                onClick={() => {changePage(item)}}
              >
                {item.pageNumber}
              </li>
            )
          })
        }
      </>
    )
  }, [pagination])

  const changePage = useCallback((pageData: page) => {
    if(pagination?.currentPage !== pageData?.pageNumber) {
      setPagination(pageData?.paginationFilters)
    }
  }, [pagination, setPagination])

  const goNextPage = useCallback(() => {
    if(!pagination) return 

    const nextPage = pagination.pagesList.find((page) => {
      return page.pageNumber === (pagination.currentPage + 1)
    })

    if(nextPage) {
      setPagination(nextPage.paginationFilters)
    }
  }, [setPagination])

  const goPreviousPage = useCallback(() => {
    if(!pagination) return 

    const previousPage = pagination.pagesList.find((page) => {
      return page.pageNumber === (pagination.currentPage - 1)
    })

    if(previousPage) {
      setPagination(previousPage.paginationFilters)
    }
  }, [setPagination])

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
          <>
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
            {
              pagination ?
              <nav className={styles.paginationComp}>
                <span>
                  Apresentando: {currentAmmount} de {pagination?.total}
                </span>
                <div className={styles.paginationActions}>
                  <span 
                    className={styles.navigateButton}
                    onClick={() => goPreviousPage()}
                  >
                    Anterior
                  </span>
                  <ul className={styles.pagesList}>
                    {
                      generateList()
                    }
                  </ul>
                  <span 
                    className={styles.navigateButton}
                    onClick={() => goNextPage()}
                  >
                    Próximo
                  </span>
                </div>
              </nav>
              :
              null
            }
          </>
      }
    </main>
  )
}
