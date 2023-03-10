import { useRouter } from "next/router";
import { useContext } from "react";
import { useEffect } from "react";

import { AuthContext } from "../../contexts/authContext";
import { SHARED_CONSTANTS } from "../../configs";
import { Redirecting } from "../../components/screens/Redirecting";

export default function() {
  const router = useRouter()
  const { setAuthContextData } = useContext(AuthContext)

  useEffect(() => {
    localStorage.removeItem(SHARED_CONSTANTS.localStorage.refreshTokenLabel)

    setAuthContextData!({
      accessToken: undefined,
      userData: undefined
    })
    
    router.push("/")
  }, [])

  return (
    <Redirecting substituteMessage="Desconectando..." />
  )
}
