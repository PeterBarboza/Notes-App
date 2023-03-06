import { useCallback, useEffect, useContext } from "react"
import { useRouter } from "next/router"
import useSWR from "swr"

import { NotesServiceFactory } from "../../../../../services/factories/notesServiceFactory"
import { AuthContext } from "../../../../../contexts/authContext"
import { SingleNote } from "../../../../../components/screens/SingleNote"
import { withRefreshTokenAuth } from "../../../../../services/shared/decorators/withRefreshTokenAuth"

export async function getServerSideProps(context: any) {
  const slugs = {
    username: context?.query?.username || null,
    noteSlug: context?.query?.noteSlug || null
  }
  return { props: { ...slugs } }
}

const notesService = new NotesServiceFactory().handle()

export default function ({ username, noteSlug }: any) {
  const { accessToken, setAuthContextData } = useContext(AuthContext)
  const router = useRouter()

  const getNote = useCallback(async () => {
    notesService.accessToken = accessToken
    try {

      const result = await withRefreshTokenAuth(
        notesService.getOne,
        {
          setAuthContextData: setAuthContextData!,
          routerInstance: router
        },
        { optional: true, thisArg: notesService }
      )([noteSlug])

      if (result?.data?.id) return result.data

      return null
    } catch (error) {
      return null
    }
  }, [noteSlug, router])

  const { data, error, isLoading, mutate } = useSWR(`/api/notes/${noteSlug || "single-note"}`, getNote)

  return (
    <SingleNote
      isLoadingNote={isLoading}
      note={data!}
      onUpdateData={async () => {
        mutate()
      }}
    />
  )
}
