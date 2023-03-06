import { useRouter } from "next/router"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"

import { useVerifyAuth } from "../../../shared/hooks/useVerifyAuth"
import { WarnActionModal } from "../../modals/WarnActionModal"

type props = {
  children: ReactNode
}

export function VerifyAuth({ children }: props) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [counter, setCounter] = useState(5)

  const redirectFunction = useCallback(() => {
    const toastId = toast.loading("Redirecionando...")

    router.push({
      pathname: '/logout/redirect/[href]',
      query: { href: "login" },
    })
    router.events.on("routeChangeComplete", () => toast.dismiss(toastId))
    router.events.on("routeChangeError", () => toast.dismiss(toastId))
  }, [router])

  const handleRedirect = useCallback(() => {
    if (counter > 0) {
      setTimeout(() => {
        setCounter(counter - 1)
      }, 1000)
      return counter
    }

    if (counter === 0) {
      redirectFunction()
    }

    return counter
  }, [counter, setCounter, redirectFunction])


  const successCallback = useCallback(() => {
    const shouldRedirect =
      router?.asPath === "/" ||
      router?.asPath === "/login" ||
      router?.asPath === "/app"

    if (shouldRedirect) {
      router.push("/app")
      return
    }
  }, [router])

  const errorCallback = useCallback(() => {
    setIsModalOpen(true)
  }, [handleRedirect])

  useVerifyAuth({ successCallback, errorCallback })

  useEffect(() => {

  }, [counter])

  const handleCloseModal = useCallback(() => {
    redirectFunction()
    setIsModalOpen(false)
  }, [])

  return (
    <>
      {children}
      {
        isModalOpen ?
          <WarnActionModal
            heading="Sessão expirada"
            bodyText="É nescessário refazer o login."
            isModalOpen={isModalOpen}
            closeModal={handleCloseModal}
            buttonText={`Ok (${handleRedirect()})`}
          />
          :
          null
      }
    </>
  )
}