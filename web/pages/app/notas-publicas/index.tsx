import { useCallback, useEffect, useState, useContext } from "react"
import useSWR from 'swr'

import { NotesServiceFactory } from "../../../services/factories/notesServiceFactory"
import { AuthContext } from "../../../contexts/authContext"
import { Feed } from "../../../components/screens/Feed"
import { NOTES_PAGE_SIZE } from "../../../shared/constants"

import { Note } from "../../../interface/schemas"
import { GetManyResponse } from "../../../services/shared/interface/responses"
import { NotesPagination, page, paginationParams } from "../../../shared/interface"

const notesService = new NotesServiceFactory().handle()

// TODO: O padrão a ser implementado nas lógicas de requisição de dados será
//   o seguinte: <DADO_RETORNADO> ou <NULO>

// Dentro dos componentes SCREENS, será feita a verificação desses valores
//   que serão recebidos via propriedades e baseado nisso será renderizado o
//   componente de exibição dos dados ou então um componente que indique ao usuário
//   a ausência de dados.

// Também serão criados um componente contendo a lógica de usuários logados
//   e outro contendo a lógica de usuários não logados.

// P.S: Aplicar o padrão descrito acima em toda a aplicação.
// P.S: Criar componente de paginação
export default function() {  
  const [getNotesResponse, setGetNotesResponse] = useState<GetManyResponse<Note> | null>(null)
  const [paginationParams, setPaginationParams] = useState<paginationParams | null>({
    limit: NOTES_PAGE_SIZE,
    skip: 0
  })
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

      if (result.data.results.length >= 0) {
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

  useEffect(() => {
    mutate()
  }, [paginationParams])

  return (
    <Feed 
      isLoadingNotes={isLoading}
      notes={data?.results?.length! > 0 ? data?.results! : null}
      pagination={data ? generatePagination(data) : null}
      setPagination={(value) => {
        console.log(value)
        setPaginationParams(value)
        mutate()
      }}
    />  
  )
}
