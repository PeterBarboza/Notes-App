import type { AppProps } from "next/app"

import { BaseLayout } from "../components/organisms/BaseLayout"

import "../styles/globals.scss"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BaseLayout>
      <Component {...pageProps} />      
    </BaseLayout>
  )
}
