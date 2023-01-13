type isValidPasswordOptionsParam = {
  minLenght?: number
  maxLenght?: number
  required?: {
    numbers?: boolean
    lowerCase?: boolean
    upperCase?: boolean
    specialChars?: boolean
  }
}

export function isValidPassword(password: string, options?: isValidPasswordOptionsParam): boolean {
  const defaultRequiredOptions = {
    numbers: true,
    lowerCase: true,
    upperCase: true,
    specialChars: true
  }
  const minLenght = options?.minLenght || 8
  const maxLenght = options?.maxLenght || 255
  const required = options?.required || defaultRequiredOptions

  const numbersValidator = /[0-9]/
  const lowerCaseValidator = /[a-z]/
  const upperCaseValidator = /[A-Z]/
  const specialCharsValidator = /[!@#$%&*()\-_=+§`´\[\]{}^~º,<.>:;?°\'"\\/]/
  
  const parsedPassword = password.trim()

  if(parsedPassword.length < minLenght) {
    return false
  }
  if(maxLenght && (parsedPassword.length > maxLenght)) {
    return false
  }

  let lowerCase = 0
  let upperCase = 0
  let numbers = 0
  let specialChars = 0

  for(let i = 0; i < parsedPassword.length; i++) {
    if(required.lowerCase && lowerCaseValidator.test(parsedPassword[i])) {
      lowerCase++
    }
    if(required.upperCase && upperCaseValidator.test(parsedPassword[i])) {
      upperCase++
    }
    if(required.numbers && numbersValidator.test(parsedPassword[i])) {
      numbers++
    }
    if(required.specialChars && specialCharsValidator.test(parsedPassword[i])) {
      specialChars++
    }
  }

  const hasLowerCase = required.lowerCase ? (lowerCase > 0) : true
  const hasUpperCase = required.upperCase ? (upperCase > 0) : true
  const hasNumbers = required.numbers ? (numbers > 0) : true
  const hasSpecialChars = required.specialChars ? (specialChars > 0) : true

  const isValid = (hasLowerCase && hasUpperCase) && (hasNumbers && hasSpecialChars)

  if(isValid) {
    return true
  }

  return false
}