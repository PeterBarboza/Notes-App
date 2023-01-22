import { useRouter } from "next/router"
import { useEffect } from "react"


export default function() {
  const router = useRouter()

  useEffect(() => {
    router.push("/app/notas-publicas")
  }, [])

  return (
    <div style={{fontSize: "1.8rem"}}>Redirecting...</div>
  )
}
