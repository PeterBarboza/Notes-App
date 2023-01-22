import type { AppProps } from "next/app"

import { VerifyAuth } from "../components/organisms/VerifyAuth"
import { AuthContextProvider } from "../contexts/authContext"

import "../styles/globals.scss"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <VerifyAuth>
        <Component {...pageProps} />      
      </VerifyAuth>
    </AuthContextProvider>
  )
}
