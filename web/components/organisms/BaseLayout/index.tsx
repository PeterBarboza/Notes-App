import { ReactNode, useContext, useState } from "react"
import { FaPen } from "react-icons/fa"
import { BsPlusLg } from "react-icons/bs"

import { Header } from "../../molecules/Header"
import { HeadMetaTags } from "../../atoms/HeadMetaTags"

import styles from "./styles.module.scss"
import { CreateNoteModal } from "../../modals/CreateNoteModal"
import { AuthContext } from "../../../contexts/authContext"

type props = {
  children: ReactNode
  onUpdateData?: () => Promise<any>
}

export function BaseLayout({ children, onUpdateData }: props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { accessToken } = useContext(AuthContext)


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <HeadMetaTags />
      <div className={styles.baselayout}>
        <Header />
        <div className={styles.layoutBox}>
          {children} 
        </div>

        {
          accessToken ? 
            <>
              <div 
                className={styles.composeNote}
                title="Adicionar nova nota"
                onClick={openModal}
              >
                <BsPlusLg size={10} className={styles.composeNoteIcon} />
                <FaPen size={20} className={styles.composeNoteIcon} />
              </div>
      
              <CreateNoteModal
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                onUpdateData={onUpdateData}
              />
            </>
            :
            null
        }
      </div>
    </>
  )
}
