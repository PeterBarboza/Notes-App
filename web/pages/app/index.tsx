import { useRouter } from "next/router"
import { useEffect } from "react"

import { Redirecting } from "../../components/screens/Redirecting"

export default function() {
  const router = useRouter()

  useEffect(() => {
    router.push("/app/notas-publicas")
  }, [])

  return (
    <Redirecting />
  )
}
