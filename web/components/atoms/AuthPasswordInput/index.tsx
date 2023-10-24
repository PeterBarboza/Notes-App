import { DetailedHTMLProps, InputHTMLAttributes, useEffect, useState } from "react"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"

import styles from "./styles.module.scss"

type props = {
  inputErrors?: string
  inputId: string
  inputLabel: string
  inputProps: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
}

export function AuthPasswordInput({
  inputId,
  inputLabel,
  inputErrors,
  inputProps,
}: props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <div className={styles.formField}>
      <label htmlFor={inputId} className={styles.label}>
        {inputLabel}
        {
          inputProps?.required ?
            <span className={styles.errorsBox}> *</span>
            :
            null
        }
        {
          inputErrors ? 
            <span className={styles.errorsBox}>{inputErrors}</span>
            :
            null
        }
      </label>
      <div className={styles.inputWrapper}>
        <input 
          id={inputId}
          type={isPasswordVisible ? "text" : "password"}
          className={styles.input}
          {...inputProps}
        />
        <div 
          className={styles.passwordVisibilityIcon} 
          onClick={() => setIsPasswordVisible(prev => !prev)}
        >
          {
            isPasswordVisible ? 
              <AiFillEye size={20} color="#747474"/>
              :
              <AiFillEyeInvisible size={20} color="#747474"/>
          }
        </div>
      </div>
    </div>
  )
}