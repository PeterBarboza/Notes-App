import { useCallback, useMemo } from "react"
import { useRouter } from "next/router"

import { NoteCard } from "../../molecules/NoteCard"
import { NotesBox } from "../../molecules/NotesBox"

import { Note } from "../../../interface/schemas"
import { NotesPagination, page, paginationParams } from "../../../shared/interface"
import { NOTES_PAGE_SIZE } from "../../../shared/constants"
import { NoDataFound } from "../../molecules/NoDataFound"

import styles from "./styles.module.scss"

type props = {
  notes: Note[]
  pagination?: NotesPagination | null
  setPagination: (args: paginationParams) => void
}

export function NotesBoard({ notes, pagination = null, setPagination }: props) {
  const presenting = useMemo(() => {
    const { currentAmmount, pageNumber } = pagination?.pagesList
      .find(page => page.pageNumber === pagination.currentPage) ||
      { currentAmmount: null, pageNumber: null }

    if(
      (currentAmmount?.constructor !== Number || isNaN(currentAmmount)) ||
      (pageNumber?.constructor !== Number || isNaN(pageNumber))
    ) {
      return null
    }

    if(pageNumber === 1) {
      return {
        from: 1,
        to: currentAmmount,
      }
    } 

    if(pagination?.pagesList[pagination?.pagesList.length - 1]?.pageNumber === pagination?.currentPage) {
      return {
        from: pagination?.total! - currentAmmount + 1,
        to: pagination?.total,
      }
    }

    return {
      from: (NOTES_PAGE_SIZE * pageNumber) - currentAmmount + 1,
      to: currentAmmount * pageNumber,
    }
  }, [pagination])

  const generateList = useCallback(() => {
    if (!pagination) return null

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
  }, [pagination])

  const changePage = useCallback((pageData: page) => {
    if(pagination?.currentPage !== pageData?.pageNumber) {
      setPagination(pageData?.paginationFilters)
    }
  }, [pagination, setPagination])

  const hasNextPage = useMemo(() => {
    if(!pagination) return

    return pagination.pagesList.find((page) => {
      return page.pageNumber === (pagination.currentPage + 1)
    })
  }, [pagination])

  const hasPreviousPage = useMemo(() => {
    if(!pagination) return

    return pagination.pagesList.find((page) => {
      return page.pageNumber === (pagination.currentPage - 1)
    })
  }, [pagination])

  const goNextPage = useCallback(() => {
    if(!pagination) return 

    if(hasNextPage) {
      setPagination(hasNextPage.paginationFilters)
    }
  }, [setPagination, hasNextPage])

  const goPreviousPage = useCallback(() => {
    if(!pagination) return 

    if(hasPreviousPage) {
      setPagination(hasPreviousPage.paginationFilters)
    }
  }, [setPagination, hasPreviousPage])

  return (
    <main className={styles.notesBoard}>
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
          {
            presenting ?
              <>
                <span>
                  Apresentando: de {presenting?.from} à {presenting?.to} Total: {pagination?.total}
                </span>
              </>
              :
              null
          }
          <div className={styles.paginationActions}>
            {
              hasPreviousPage ? 
              <span 
                className={styles.navigateButton}
                onClick={() => goPreviousPage()}
              >
                Anterior
              </span>
              :
              null
            }
            <ul className={styles.pagesList}>
              {
                generateList()
              }
            </ul>
            {
              hasNextPage ? 
              <span 
                className={styles.navigateButton}
                onClick={() => goNextPage()}
              >
                Próximo
              </span>
              :
              null
            }
          </div>
        </nav>
        :
        null
      }
    </main>
  )
}
