import { useRouter } from "next/router"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"

import { UsersServiceFactory } from "../../../services/factories/usersServiceFactory"
import { BaseLayout } from "../../organisms/BaseLayout"
import { useGetNewCredentials } from "../../../shared/hooks/useGetNewCredentials"
import { parseErrorsArray } from "../../../shared/utils/parseErrorsArray"
import { AuthContext } from "../../../contexts/authContext"

import { updateEmailParams, updatePasswordParams } from "../../../services/shared/interface/requestParams"

import styles from "./styles.module.scss"
import { useVerifyPasswordFormat } from "../../../shared/hooks/useVerifyPasswordFormat"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"

export function UpdateAcessData() {
  const [newEmail, setNewEmail] = useState("")
  const [password, setPassword] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false)
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false)
  const { accessToken, userData } = useContext(AuthContext)

  const usersService = useMemo(() => new UsersServiceFactory().handle(accessToken), [accessToken])

  const { 
    isValid, 
    charsLength, 
    lowerCase, 
    numbers, 
    specialChars, 
    upperCase 
  } = useVerifyPasswordFormat(newPassword)

  const updateEmail = useCallback(async (updateData: updateEmailParams) => {
    const toastId = toast.loading("Editando perfil...")

    const result: any = await usersService.updateEmail(userData?.id!, updateData)

    if(result?.data?.updatedCount === 1) {
      toast.update(toastId, { 
        render: "Dados atualizados com sucesso", 
        type: "success", 
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });

      return
    }

    if(result.data?.message) {
      toast.update(toastId, { 
        render: result.data?.message, 
        type: "error", 
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      })
      return
    }

    if(result.data?.errors) {
      toast.update(toastId, { 
        render: parseErrorsArray(result.data?.errors),
        type: "error", 
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      })
      return
    }

    toast.update(toastId, { 
      render: "Erro ao atualizar dados", 
      type: "error", 
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
  }, [userData])

  const updatePassword = useCallback(async (updateData: updatePasswordParams) => {
    const toastId = toast.loading("Editando perfil...")
    
    const result: any = await usersService.updatePassword(userData?.id!, updateData)

    if(result?.data?.updatedCount === 1) {
      toast.update(toastId, { 
        render: "Dados atualizados com sucesso", 
        type: "success", 
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });

      return
    }

    if(result.data?.message) {
      toast.update(toastId, { 
        render: result.data?.message, 
        type: "error", 
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      })
      return
    }

    if(result.data?.errors) {
      toast.update(toastId, { 
        render: parseErrorsArray(result.data?.errors),
        type: "error", 
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      })
      return
    }

    toast.update(toastId, { 
      render: "Erro ao atualizar dados", 
      type: "error", 
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
  }, [userData])

  return (
    <BaseLayout createNoteButtonEnabled={false}>
      <div className={styles.userNotesProfileBox}>
        <h1>Alterar email</h1>
        <form className={styles.form} onSubmit={(e) => { 
          e.preventDefault()
          updateEmail({ email: newEmail, password })
        }}>
          <div className={styles.fieldWrapper}>
            <label className={styles.label} htmlFor="update-email-new-email">Novo email</label>
            <input 
              id="update-email-new-email"
              value={newEmail} 
              className={styles.input}
              onChange={(event) => {
                setNewEmail(event?.target?.value)
              }}
            />
          </div>
            {
              newEmail.length < 1 ?
              <ul className={styles.passwordFormatInstructions}>
                <li>
                  * Para poder alterar seu email este campo não pode estar vazio
                </li>
              </ul>
              :
              null
            }
          <div className={styles.fieldWrapper}>
            <label className={styles.label} htmlFor="update-email-password-field">Senha atual</label>
            <div className={styles.inputWrapper}>
              <input 
                id="update-email-password-field"
                type={isPasswordVisible ? "text" : "password"}
                value={password} 
                className={styles.input}
                onChange={(event) => {
                  setPassword(event?.target?.value)
                }}
              />
              <div className={styles.passwordVisibilityIcon}>
                {
                  isPasswordVisible ? 
                    <AiFillEye 
                      size={20} 
                      color="#bbbbbb" 
                      onClick={() => setIsPasswordVisible(false)}
                    /> 
                    : 
                    <AiFillEyeInvisible 
                      size={20} 
                      color="#bbbbbb" 
                      onClick={() => setIsPasswordVisible(true)}
                    />
                }
              </div>
            </div>
          </div>
          {
            password.length < 1 ?
            <ul className={styles.passwordFormatInstructions}>
              <li>
                * Para poder alterar seu email este campo não pode estar vazio
              </li>
            </ul>
            :
            null
          }
          <div className={styles.submitInputBox}>
            <input
              type="submit" 
              value="Alterar email"
              className={`
                ${styles.submitInput} 
                ${newEmail.length < 1 || password.length < 1 ? styles.disabledSubmitInput : ""}
              `}
              disabled={newEmail.length < 1 || password.length < 1 ? true : false}
            />
          </div>
        </form>
        <h1>Alterar senha</h1>
        <form className={styles.form} onSubmit={(e) => { 
          e.preventDefault()
          updatePassword({ newPassword, oldPassword })
        }}>
          <div className={styles.fieldWrapper}>
            <label className={styles.label} htmlFor="update-password-old-password">Senha atual</label>
            <div className={styles.inputWrapper}>
              <input 
                id="update-password-old-password"
                type={isOldPasswordVisible ? "text" : "password"}
                value={oldPassword} 
                className={styles.input}
                onChange={(event) => {
                  setOldPassword(event?.target?.value)
                }}
              />
              <div 
                className={styles.passwordVisibilityIcon}
                onClick={() => setIsOldPasswordVisible(prev => !prev)}
              >
                {
                  isOldPasswordVisible ? 
                    <AiFillEye 
                      size={20} 
                      color="#bbbbbb" 
                    /> 
                    : 
                    <AiFillEyeInvisible 
                      size={20} 
                      color="#bbbbbb" 
                    />
                }
              </div>
            </div>
          </div>
          {
            oldPassword.length < 1 ?
            <ul className={styles.passwordFormatInstructions}>
              <li>
                * Para poder alterar sua senha este campo não pode estar vazio
              </li>
            </ul>
            :
            null
          }
          <div className={styles.fieldWrapper}>
            <label className={styles.label} htmlFor="update-password-new-password">Nova senha</label>
            <div className={styles.inputWrapper}>
              <input 
                id="update-password-new-password"
                type={isNewPasswordVisible ? "text" : "password"}
                value={newPassword} 
                className={styles.input}
                onChange={(event) => {
                  setNewPassword(event?.target?.value)
                }}
              />
              <div
                className={styles.passwordVisibilityIcon} 
                onClick={() => setIsNewPasswordVisible(prev => !prev)}
              >
                {
                  isNewPasswordVisible ? 
                    <AiFillEye 
                      size={20} 
                      color="#bbbbbb" 
                    /> 
                    : 
                    <AiFillEyeInvisible 
                      size={20} 
                      color="#bbbbbb" 
                    />
                }
              </div>
            </div>
          </div>
          <ul className={styles.passwordFormatInstructions}>
            <li className={charsLength ? styles.passwordInstructionPassed : ""}>* A senha deve conter no mínimo 8 caracteres;</li>
            <li className={upperCase ? styles.passwordInstructionPassed : ""}>* Uma letra maiúscula;</li>
            <li className={lowerCase ? styles.passwordInstructionPassed : ""}>* Uma letra minúscula;</li>
            <li className={numbers ? styles.passwordInstructionPassed : ""}>* Um número;</li>
            <li className={specialChars ? styles.passwordInstructionPassed : ""}>* Um caractere especial;</li>
          </ul>
          <div className={styles.submitInputBox}>
            <input
              type="submit" 
              value="Alterar senha"
              className={`${styles.submitInput} ${!isValid ? styles.disabledSubmitInput : ""}`}
              disabled={!isValid}
            />
          </div>
        </form>
      </div>
    </BaseLayout>
  )
}