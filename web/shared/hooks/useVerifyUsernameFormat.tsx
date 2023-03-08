import { useCallback, useEffect, useState } from "react"

export function useVerifyUsernameFormat(username: string) {
  const [charsLength, setCharsLength] = useState(false)
  const [letters, setLetters] = useState(false)
  const [specialChars, setSpecialChars] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const verifyUsernameFormat = useCallback((user: string) => {
    const invalidCharsValidator = /^[a-zA-Z0-9_.-]+$/
    const lettersValidation = /[a-zA-z]/

    const parsedUsername = user.trim()

    let userCharsLength = 0
    let lettersAmmount = 0
    let invalidSpecialCharsAmmount = 0

    if (parsedUsername.length > 1) {
      userCharsLength++
    }

    for (let i = 0; i < parsedUsername.length; i++) {
      if (!invalidCharsValidator.test(parsedUsername[i])) {
        invalidSpecialCharsAmmount++
      }
      if (lettersValidation.test(parsedUsername[i])) {
        lettersAmmount++
      }
    }

    if (userCharsLength > 0) {
      setCharsLength(true)
    } else {
      setCharsLength(false)
    }
    if (lettersAmmount > 1) {
      setLetters(true)
    } else {
      setLetters(false)
    }
    if (invalidSpecialCharsAmmount > 0) {
      setSpecialChars(false)
    } else {
      setSpecialChars(true)
    }

    if (
      userCharsLength > 0 &&
      lettersAmmount > 1 &&
      invalidSpecialCharsAmmount === 0
    ) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }, [setCharsLength, setLetters, setSpecialChars, setIsValid])

  useEffect(() => {
    verifyUsernameFormat(username)
  }, [username])

  return {
    charsLength,
    letters,
    specialChars,
    isValid,
  }
}

