import { BiBlock } from "react-icons/bi"

import styles from "./styles.module.scss"

type props = {
  messages: string[]
}

export function NoDataFound({ messages }: props) {
  return (
    <div className={styles.noDataFound}>
      <BiBlock 
        size={80} 
        color="#9b9b9b"
        className={styles.icon}
      />
      <div>
        {
          messages.map((message) => {
            return (
              <p>{message}</p>
            )
          })
        }
      </div>
    </div>
  )
}