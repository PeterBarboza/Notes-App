import { useState, useContext, useCallback, useEffect } from "react"
import { useRouter } from "next/router"
import useSWR from "swr"

import { AuthContext } from "../../../../contexts/authContext"
import { UserNotes } from "../../../../components/screens/UserNotes"
import { withRefreshTokenAuth } from "../../../../services/shared/decorators/withRefreshTokenAuth"
import { NotesServiceFactory } from "../../../../services/factories/notesServiceFactory"
import { NOTES_PAGE_SIZE } from "../../../../shared/constants"

import { NotesPagination, page, paginationParams } from "../../../../shared/interface"
import { GetManyResponse } from "../../../../services/shared/interface/responses"

export async function getServerSideProps(context: any) {
  const slugs = {
    username: context.query.username,
  }
  return { props: { ...slugs } }
}

const notesService = new NotesServiceFactory().handle()

export default function({ username }: any) {  
  const [paginationParams, setPaginationParams] = useState<paginationParams | null>({
    limit: NOTES_PAGE_SIZE,
    skip: 0
  })
  const { accessToken, setAuthContextData } = useContext(AuthContext)
  const router = useRouter()

  const getNotes = useCallback(async () => {
    notesService.accessToken = accessToken
    try {
      const result = await withRefreshTokenAuth(
        notesService.getMany,
        {
          setAuthContextData: setAuthContextData!,
          routerInstance: router
        },
        { optional: true, thisArg: notesService }
      )
      (
        paginationParams ?
          [
            {
              pagination: paginationParams,
              filters: {
                author: {
                  username: username
                }
              }
            }
          ]
          : 
          [
            {
              pagination: {
                limit: NOTES_PAGE_SIZE,
                skip: 0
              },
              filters: {
                author: {
                  username: username
                }
              }
            }
          ]
      )

      if (result?.data?.results?.length! >= 0) {
        return result?.data!
      }
      return null
    } catch (error) {
      return null
    }
  }, [accessToken, notesService, paginationParams, username])

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

  useEffect(() => {
    mutate()
  }, [paginationParams])

  return (
    <UserNotes 
      isLoadingNotes={isLoading}
      notes={data?.results?.length! > 0 ? data?.results! : null}
      pagination={data ? generatePagination(data) : null}
      setPagination={(value) => {
        setPaginationParams(value)
      }}
      username={username}
    />
  )
}
