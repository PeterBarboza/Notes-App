import type { AppProps } from "next/app"

import AuthContextProvider from "../contexts/authContext"

import "../styles/globals.scss"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />      
    </AuthContextProvider>
  )
}
