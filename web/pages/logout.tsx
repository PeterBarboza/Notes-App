import { useRouter } from "next/router";
import { useContext } from "react";
import { useEffect } from "react";

import { AuthContext } from "../contexts/authContext";
import { SHARED_CONSTANTS } from "../configs";

export async function getServerSideProps(context: any) {
  const sla = {
    redirectURL: context?.query?.redirectTo || null
  }
  console.log(context)
  return { props: { ...sla } }
}

export default function({ redirectURL }: any) {
  const router = useRouter()
  const { setAuthContextData } = useContext(AuthContext)

  useEffect(() => {
    localStorage.removeItem(SHARED_CONSTANTS.localStorage.refreshTokenLabel)

    setAuthContextData!({
      accessToken: undefined,
      userData: undefined
    })

    if(redirectURL) {
      router.push(redirectURL)
      return
    }

    router.push("/")
  }, [])

  return (
    <div style={{fontSize: "1.8rem"}}>Saindo...</div>
  )
}
