import { CSSProperties, ReactNode, useState } from "react";
import { Modal } from "react-responsive-modal"
import "react-responsive-modal/styles.css"

import styles from "./styles.module.scss"

type props = {
  heading: string
  isOpen: boolean
  closeModal: () => void
  children: ReactNode
}

type modalStylesClasses = {
  root?: string;
  overlay?: string;
  overlayAnimationIn?: string;
  overlayAnimationOut?: string;
  modalContainer?: string;
  modal?: string;
  modalAnimationIn?: string;
  modalAnimationOut?: string;
  closeButton?: string;
  closeIcon?: string;
}

export function BaseModal({
  heading,
  isOpen,
  closeModal,
  children
}: props) {

  const modalStyles: modalStylesClasses = {
    modal: styles.modal,
    modalContainer: styles.modalContainer,
  }

  return (
    <Modal 
      open={isOpen} 
      onClose={closeModal} 
      center showCloseIcon={false} 
      classNames={modalStyles}
    >
      <h2>{heading}</h2>
      {children}
    </Modal>
  )
}