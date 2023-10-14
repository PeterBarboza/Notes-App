import type { AppProps } from "next/app"

import { BaseLayout } from "../components/organisms/BaseLayout"
import AuthContextProvider from "../contexts/authContext"

import "../styles/globals.scss"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <BaseLayout>
        <Component {...pageProps} />      
      </BaseLayout>
    </AuthContextProvider>
  )
}
