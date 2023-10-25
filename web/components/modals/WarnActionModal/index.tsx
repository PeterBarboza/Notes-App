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
}

export function WarnActionModal({ heading, bodyText, buttonText, action, closeModal, isModalOpen }: props) {
  const handleAction = useCallback(async () => {
    try {
      if(action) await action()
    } catch (error) {}
    finally {
      closeModal()
    }
  }, [closeModal, action])

  return (
    <BaseModal
      // heading={heading}
      isOpen={isModalOpen}
      closeModal={handleAction}
    >
      <div className={styles.modalBox}>
        <div className={styles.modalHeading}>
          <AiOutlineInfoCircle size={25}/>
          <h2>{heading}</h2>
        </div>

        <p>{bodyText}</p>

        <button
          className={styles.actionButton}
          onClick={handleAction}
        >
          {buttonText}
        </button>
      </div>
    </BaseModal>
  )
}
