import { useCallback, useContext, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { BsPersonCircle } from "react-icons/bs"
import { RxMagnifyingGlass } from "react-icons/rx"
import { AiOutlineArrowLeft } from "react-icons/ai"

import { SearchBarInputAndPreview } from "../../atoms/SearchBarInputAndPreview"
import { AuthContext } from "../../../contexts/authContext"

import styles from "./styles.module.scss"

export function Header() {
  const router = useRouter()
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const { accessToken, userData } = useContext(AuthContext)

  const handleMenu = useCallback(() => setIsMenuOpen(prevState => !prevState), [])

  useEffect(() => {
    router.events.on("routeChangeComplete", () => setIsMenuOpen(false))
  }, [])

  return (
    <>
      <header className={styles.header}>
        <Link href="/app/notas-publicas">
          <div className={styles.logo}>
            <span>Notes</span>
          </div>
        </Link>

        {
          isFocused ?
            (
              <div className={styles.searchBarBox}>
                <div className={styles.inputBox}>
                  <AiOutlineArrowLeft
                    size={25}
                    color="#ffffff"
                    onClick={() => {
                      setIsFocused(false)
                    }}
                    className={styles.arrowLeft}
                  />
                  <SearchBarInputAndPreview
                    setIsInputFocused={setIsFocused}
                  />
                </div>            
              </div>
            )
          :
            null
        }
        {/* The component bellow will appear after 800px width screen */}
        <div className={styles.searchBarBoxBigScreen}>
          <SearchBarInputAndPreview
            setIsInputFocused={setIsFocused}
          />
        </div>
        
        <div className={styles.headerEnd}>
          <RxMagnifyingGlass 
            size={30}
            color="#ffffff"
            className={styles.magnifying}
            onClick={() => {
              setIsFocused(true)
            }}
          />

          <BsPersonCircle 
            size={40}
            color="#ffffff"
            className={styles.profile}
            onClick={handleMenu}
          />
        </div>
      </header>
      <div 
        className={
          `${styles.sideBarBackgroundShadow} ${isMenuOpen ? styles.visibleBackgroundShadow : ""}`
        }
        onClick={handleMenu}
      >
      </div>

      {
        accessToken ?
          <aside className={
            `${styles.sideBar} ${isMenuOpen && styles.visibleSideBar}`
          }>
            <div className={styles.sideBarHeader}>
              <AiOutlineArrowLeft
                size={25}
                color="#ffffff"
                className={styles.arrowLeft}
                onClick={handleMenu}
              />
              <div className={styles.sideBarHeaderEnd}>
                <p>{userData?.username}</p>
                <BsPersonCircle 
                  size={30}
                  color="#ffffff"
                  className={styles.profile}
                  onClick={handleMenu}
                />
              </div>
            </div>
            <ul className={styles.sideBarOptionsBox}>
              <Link 
                href={`/app/usuarios/${userData?.username}`}
                className={styles.optionLinkWrap}
              >
                <li>Minhas notas</li>
              </Link>
              <Link 
                href="#"
                className={styles.optionLinkWrap}
              >
                <li>Editar perfil</li>
              </Link>
              <Link 
                href="/logout"
                className={styles.optionLinkWrap}
              >
                <li>Sair</li>
              </Link>
            </ul>
          </aside>
        :
          <aside className={
            `${styles.sideBar} ${isMenuOpen && styles.visibleSideBar}`
          }>
            <div className={styles.sideBarHeader}>
              <AiOutlineArrowLeft
                size={25}
                color="#ffffff"
                className={styles.arrowLeft}
                onClick={handleMenu}
              />
              <div className={styles.sideBarHeaderEnd}>
                <p></p>
                <BsPersonCircle 
                  size={30}
                  color="#ffffff"
                  className={styles.profile}
                  onClick={handleMenu}
                />
              </div>
            </div>
            <ul className={styles.sideBarOptionsBox}>
              <Link 
                href="/login"
                className={styles.optionLinkWrap}
              >
                <li>Fazer login</li>
              </Link>
            </ul>
          </aside>
      }
    </>
  )
}