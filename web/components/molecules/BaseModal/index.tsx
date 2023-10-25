import { LegacyRef, ReactNode, useCallback, useMemo, useRef } from "react"
import styles from "./styles.module.scss"


type props = {
  heading?: string
  isOpen: boolean
  closeModal: () => void
  children: ReactNode
}

export function BaseModal({
  heading,
  isOpen,
  closeModal,
  children,
}: props) {
  const backgroundShadowRef = useRef<HTMLDivElement>(null)
  const baseModalRef = useRef<HTMLDivElement>(null)

  const closeTransitionClass = useMemo(() => {
    return styles.closeTransition
  }, [])

  const handleCloseModal = useCallback(() => {
    if(backgroundShadowRef.current?.className) {
      backgroundShadowRef.current.className += ` ${closeTransitionClass}`
    }
    if(baseModalRef.current?.className) {
      baseModalRef.current.className += ` ${closeTransitionClass}`
    }

    setTimeout(() => {
      closeModal()
    }, 100)
  }, [closeModal])

  return (
    isOpen ?
      <>
        <div 
          className={styles.backgroundShadow} 
          onClick={() => handleCloseModal()} 
          ref={backgroundShadowRef}
        />

        <div 
          className={styles.baseModal}
          ref={baseModalRef}
        >
          {
            heading ?
              <h2>{heading}</h2>
              :
              null
          }
          {children}
        </div>
      </>
    :
      null
  )
}
