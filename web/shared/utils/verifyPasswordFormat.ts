type verifyPasswordFormatReturn = {
  charsLength: boolean,
  lowerCase: boolean,
  upperCase: boolean,
  numbers: boolean,
  specialChars: boolean,
}

export function verifyPasswordFormat(password: string): verifyPasswordFormatReturn {
  const minLength = 8
  const numbersValidator = /[0-9]/
  const lowerCaseValidator = /[a-z]/
  const upperCaseValidator = /[A-Z]/
  const specialCharsValidator = /[!@#$%&*()\-_=+§`´\[\]{}^~º,<.>:;?°\'"\\/]/

  let charsLength = false
  let lowerCase = false
  let upperCase = false
  let numbers = false
  let specialChars = false
  
  const parsedPassword = password.trim()

  if(parsedPassword.length >= minLength) {
    charsLength = true
  }

  for(let i = 0; i < parsedPassword.length; i++) {
    if(lowerCaseValidator.test(parsedPassword[i])) {
      lowerCase = true
    }
    if(upperCaseValidator.test(parsedPassword[i])) {
      upperCase = true
    }
    if(numbersValidator.test(parsedPassword[i])) {
      numbers = true
    }
    if(specialCharsValidator.test(parsedPassword[i])) {
      specialChars = true
    }
  }

  return {
    charsLength,
    lowerCase,
    upperCase,
    numbers,
    specialChars,
  }
}