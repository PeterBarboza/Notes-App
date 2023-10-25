import { Loading } from "../../molecules/Loading"

import styles from "./styles.module.scss"

type props = {
  substituteMessage?: string
}

export function Redirecting({ substituteMessage }: props) {
  return (
    <div className={styles.redirecting}>
      <Loading 
        substituteMessage={
          `${substituteMessage ? substituteMessage : "Redirecionando..."}
      `}/>
    </div>
  )
}