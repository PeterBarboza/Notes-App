import { useCallback, useContext } from "react"
import { AiOutlineInfoCircle } from "react-icons/ai"

import { BaseModal } from "../../molecules/BaseModal"

import styles from "./styles.module.scss"

type props = {
  heading: string
  bodyText: string
  action?: () => void | Promise<void>
  buttonText: string
  isModalOpen: boolean
  closeModal: () => void
  type?: "dangerous" | "info",
  forceAction?: boolean
}

export function WarnActionModal({
  heading,
  bodyText,
  buttonText,
  action,
  closeModal,
  forceAction,
  isModalOpen,
  type
}: props) {
  const handleAction = useCallback(async () => {
    try {
      if (action) await action()
    } catch (error) { }
    finally {
      closeModal()
    }
  }, [closeModal, action])

  return (
    <BaseModal
      // heading={heading}
      isOpen={isModalOpen}
      closeModal={async () => {
        if (forceAction) {
          await handleAction()
          return
        }
        closeModal()
      }}
    >
      <div className={styles.modalBox}>
        <div className={styles.modalHeading}>
          <AiOutlineInfoCircle size={25} />
          <h2>{heading}</h2>
        </div>

        <p>{bodyText}</p>

        <button
          className={styles.actionButton}
          onClick={handleAction}
          style={type === "dangerous" ? { backgroundColor: "#e60101" } : {}}
        >
          {buttonText}
        </button>
      </div>
    </BaseModal>
  )
}
