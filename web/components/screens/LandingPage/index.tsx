import Link from "next/link";
import { AiFillLinkedin, AiOutlineGithub, AiOutlineGlobal } from "react-icons/ai";

import styles from "./styles.module.scss"

const heartEmoji = String.fromCodePoint(0x1F496);

export function LandingPage() {

  return (
    <div className={styles.landingPageLayout}>
      <main className={styles.main}>
        <div className={styles.layout}>
          <div className={styles.hero}>
            <h1>Notes APP</h1>
            <h2>Compartilhe ou guarde suas ideias</h2>
          </div>

          <div className={styles.ctaBox}>
            <Link href="/login" className={styles.linkWrapper}>
              <button className={styles.login}>
                Conectar
              </button>
            </Link>
            <Link href="/criar-conta" className={styles.linkWrapper}>
              <button className={styles.createAccount}>
                Cadastre-se
              </button>
            </Link>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <p className={styles.greetings}>
          Desenvolvido com {heartEmoji} por Pedro Barboza
        </p>
        <Link className={styles.footerLink} href="https://github.com/PeterBarboza" rel="me">
          <p>
            <AiOutlineGithub 
              size={20} 
              color="#0084ff" 
            /> 
            @PeterBarboza
          </p>
        </Link>
        <Link className={styles.footerLink} href="https://www.linkedin.com/in/pedro-barboza-webdev/" rel="me">
          <p>
            <AiFillLinkedin 
              size={20} 
              color="#0084ff" 
            /> 
            @PedroBarboza
          </p>
        </Link>
        <Link className={styles.footerLink} href="https://www.pedrobarboza.com/" rel="me">
          <p>
            <AiOutlineGlobal 
              size={17} 
              color="#0084ff" 
            /> 
            www.pedrobarboza.com
          </p>
        </Link>
      </footer>
    </div>
  )
}