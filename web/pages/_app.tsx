import type { AppProps } from "next/app"
import { ToastContainer } from "react-toastify"

import { VerifyAuth } from "../components/organisms/VerifyAuth"
import { AuthContextProvider } from "../contexts/authContext"

import "../styles/globals.scss"
import "react-toastify/dist/ReactToastify.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <VerifyAuth>
        <Component {...pageProps} />      
        <ToastContainer
          style={{
            fontSize: "1rem"
          }}
        />
      </VerifyAuth>
    </AuthContextProvider>
  )
}
