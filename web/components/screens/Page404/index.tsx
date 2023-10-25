import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/router"

import { BaseLayout } from "../../organisms/BaseLayout"
import { NoDataFound } from "../../molecules/NoDataFound"
import { toast } from "react-toastify"

export function Page404() { 
  const [counter, setCounter] = useState(5)
  const router = useRouter()

  const handleRedirect = useCallback(() => {
    if(counter > 0) {
      setTimeout(() => {
        setCounter(counter - 1)
      }, 1000)
      return counter
    }
    
    if(counter === 0) {
      const toastId = toast.loading("Redirecionando...")
  
      router.push("/app/notas-publicas")
      router.events.on("routeChangeComplete", () => toast.dismiss(toastId))
      router.events.on("routeChangeError", () => toast.dismiss(toastId))
    }

    return counter
  }, [counter, setCounter])

  return (
    <BaseLayout createNoteButtonEnabled={false}>
      <NoDataFound 
        messages={[
          "Essa página não existe em nosso site.",
          "Você será redirecionado para:",
          `\"app/notas-publicas\" em (${handleRedirect()})s`
        ]}
      />
    </BaseLayout>
  )
}
