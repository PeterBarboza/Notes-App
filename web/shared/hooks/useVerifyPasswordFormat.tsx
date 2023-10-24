import { useCallback, useEffect, useState } from "react"

export function useVerifyPasswordFormat(password: string) {
  const [charsLength, setCharsLength] = useState(false)
  const [lowerCase, setLowerCase] = useState(false)
  const [upperCase, setUpperCase] = useState(false)
  const [numbers, setNumbers] = useState(false)
  const [specialChars, setSpecialChars] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const verifyPasswordFormat = useCallback((pass: string) => {
    const minLength = 8
    const numbersValidator = /[0-9]/
    const lowerCaseValidator = /[a-z]/
    const upperCaseValidator = /[A-Z]/
    const specialCharsValidator = /[!@#$%&*()\-_=+§`´\[\]{}^~º,<.>:;?°\'"\\/]/
    
    const parsedPassword = pass.trim()

    let passCharsLength = 0
    let lowerCaseAmmount = 0
    let upperCaseAmmount = 0
    let numbersAmmount = 0
    let specialCharsAmmount = 0

    if(parsedPassword.length >= minLength) {
      passCharsLength++
    }

    for(let i = 0; i < parsedPassword.length; i++) {
      if(lowerCaseValidator.test(parsedPassword[i])) {
        lowerCaseAmmount++
      }
      if(upperCaseValidator.test(parsedPassword[i])) {
        upperCaseAmmount++
      }
      if(numbersValidator.test(parsedPassword[i])) {
        numbersAmmount++
      }
      if(specialCharsValidator.test(parsedPassword[i])) {
        specialCharsAmmount++
      }
    }

    if(passCharsLength > 0) {
      setCharsLength(true)
    } else {
      setCharsLength(false)
    }
    if(lowerCaseAmmount > 0) {
      setLowerCase(true)
    } else {
      setLowerCase(false)
    }
    if(upperCaseAmmount > 0) {
      setUpperCase(true)
    } else {
      setUpperCase(false)
    }
    if(numbersAmmount > 0) {
      setNumbers(true)
    } else {
      setNumbers(false)
    }
    if(specialCharsAmmount > 0) {
      setSpecialChars(true)
    } else {
      setSpecialChars(false)
    }

    if(
      passCharsLength > 0 && 
      lowerCaseAmmount > 0 && 
      upperCaseAmmount > 0 && 
      numbersAmmount > 0 && 
      specialCharsAmmount > 0
    ) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }, [setCharsLength, setLowerCase, setUpperCase, setNumbers, setSpecialChars])

  useEffect(() => {
    verifyPasswordFormat(password)
  }, [password])
  
  return {
    isValid,
    charsLength,
    lowerCase,
    upperCase,
    numbers,
    specialChars,
  }
}

