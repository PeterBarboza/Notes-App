import { useCallback, useEffect, useState, useContext } from "react"
import useSWR from 'swr'

import { NotesServiceFactory } from "../../../services/factories/notesServiceFactory"
import { AuthContext } from "../../../contexts/authContext"
import { NOTES_PAGE_SIZE } from "../../../shared/constants"
import { useLoadingToast } from "../../../shared/hooks/useLoadingToast"
import { PublicNotes } from "../../../components/screens/PublicNotes"

import { GetManyResponse } from "../../../services/shared/interface/responses"
import { NotesPagination, page, paginationParams } from "../../../shared/interface"

const notesService = new NotesServiceFactory().handle()

export default function() {  
  const [paginationParams, setPaginationParams] = useState<paginationParams | null>({
    limit: NOTES_PAGE_SIZE,
    skip: 0
  })
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true)
  const { accessToken } = useContext(AuthContext)
  
  const getNotes = useCallback(async () => {
    notesService.accessToken = accessToken
    try {
      const result = await notesService.getMany(
        paginationParams ?
          {
            pagination: paginationParams
          }
          : 
          {
            pagination: {
              limit: NOTES_PAGE_SIZE,
              skip: 0
            }
          }
      )

      if (result?.data?.results?.length > 0) {
        return result.data
      }
      return null
    } catch (error) {
      return null
    }
  }, [accessToken, notesService, paginationParams])

  const { data, error, isLoading, mutate } = useSWR('/api/notes/feed', getNotes)

  const generatePagination = useCallback(
    function <Entity = any>(getManyResponse: GetManyResponse<Entity>): NotesPagination | null {
      if (
        !getManyResponse?.pagination || 
        getManyResponse?.results?.length === undefined
      ) return null

      const { total, limit, skip } = getManyResponse.pagination
      const currentAmmount = getManyResponse.results.length
      const totalPagesAmmount = Math.ceil(total / NOTES_PAGE_SIZE)

      const pagesList: page[] = []

      const currentPage = Math.ceil(skip / NOTES_PAGE_SIZE) + 1
      
      for (let page = 1; page <= totalPagesAmmount; page++) {
        pagesList.push({
          currentAmmount: currentAmmount,
          pageNumber: page,
          paginationFilters: {
            limit: limit,
            skip: page === 1 ? 0 : limit * (page - 1)
          }
        })
      }

      return {
        currentPage: currentPage,
        pagesList: pagesList,
        total: total
      }
    },
    []
  )

  useLoadingToast({ 
    callbackDeps: [paginationParams],
    errorMessage: error,
    asyncMethod: mutate,
    noToastCondition: isFirstRender,
    noToastCallback: () => setIsFirstRender(false),
    customLoadingToastMessage: "Carregando notas..."
  })

  return (
    <PublicNotes 
      isLoadingNotes={isLoading}
      notes={data?.results || null}
      pagination={data ? generatePagination(data) : null}
      setPagination={(value) => {
        setPaginationParams(value)
      }}
      onUpdateData={mutate}
    />  
  )
}
