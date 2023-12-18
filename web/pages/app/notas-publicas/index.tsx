import { useCallback, useEffect, useState, useContext } from "react"

import { NotesServiceFactory } from "../../../services/factories/notesServiceFactory"
import { AuthContext } from "../../../contexts/authContext"
import { Feed } from "../../../components/screens/Feed"

import { Note } from "../../../interface/schemas"
import { GetManyResponse } from "../../../services/shared/interface/responses"

const notesService = new NotesServiceFactory().handle()

//TODO: O padrão a ser implementado nas lógicas de requisição de dados será
  //o seguinte: <DADO_RETORNADO> ou <NULO>

//Dentro dos componentes SCREENS, será feita a verificação desses valores
  //que serão recebidos via propriedades e baseado nisso será renderizado o
  //componente de exibição dos dados ou então um componente que indique ao usuário
  // a ausência de dados.

//Também serão criados um componente contendo a lógica de usuários logados
  //e outro contendo a lógica de usuários não logados.

//P.S: Aplicar o padrão descrito acima em toda a aplicação.
//P.S: Criar componente de paginação
export default function() {  
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false)
  const [notes, setNotes] = useState<GetManyResponse<Note>>({
    pagination: {
      total: 0,
      limit: 10,
      skip: 0
    },
    results: []
  })
  const { accessToken } = useContext(AuthContext)
  
  const getNotes = useCallback(async () => {
    notesService.accessToken = accessToken
    try {
      setIsLoadingNotes(true)
      
      const result = await notesService.getMany({})
      setNotes(result.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingNotes(false)
    }
  }, [])

  useEffect(() => {
    getNotes()
  }, [getNotes])

  return (
    <Feed 
      isLoadingNotes={isLoadingNotes} 
      notes={notes.results.length > 0 ? notes.results : null}
    />  
  )
}
