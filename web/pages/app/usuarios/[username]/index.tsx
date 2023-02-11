import { useState, useContext, useCallback, useEffect } from "react"

import { AuthContext } from "../../../../contexts/authContext"
import { UsersServiceFactory } from "../../../../services/factories/usersServiceFactory"

import { User } from "../../../../interface/schemas"

import { UserNotes } from "../../../../components/screens/UserNotes"
import { withRefreshTokenAuth } from "../../../../services/shared/decorators/withRefreshTokenAuth"
import { useRouter } from "next/router"

export async function getServerSideProps(context: any) {
  const slugs = {
    username: context.query.username,
  }
  return { props: { ...slugs } }
}

const usersService = new UsersServiceFactory().handle()

export default function({ username }: any) {
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false)
  const [userData, setUserData] = useState<User>()
  const { accessToken, setAuthContextData } = useContext(AuthContext)
  const router = useRouter()  

  const getNotes = useCallback(async () => {
    usersService.accessToken = accessToken
    try {  
      setIsLoadingNotes(true)
      
      const result = await withRefreshTokenAuth(
        usersService.getOneWithNotes.bind(usersService), 
        { 
          setAuthContextData: setAuthContextData!,
          routerInstance: router 
        }, 
        { optional: true }
      )(username)

      if(result?.data) {
        result.data.notes = result.data.notes.map((note) => {
          return {
            ...note,
            author: {
              ...result.data!,
              notes: []
            }
          }
        })
        setUserData(result.data)
      }
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
    <UserNotes userData={userData!} isLoadingNotes={isLoadingNotes} />
  )
}
