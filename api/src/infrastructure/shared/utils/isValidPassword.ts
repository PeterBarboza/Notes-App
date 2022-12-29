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

const regexValidator = /[a-z0-1!@#$%&*()\-_=+§`´\[\]{}^~º,<.>:;?°\'"\\]/gi

export function isValidPassword(password: string, options?: isValidPasswordOptionsParam): boolean {
  const defaultRequiredOptions = {
    numbers: true,
    lowerCase: true,
    upperCase: true,
    specialChars: true
  }
  const minLenght = options?.minLenght || 8
  const maxLenght = options?.maxLenght || undefined
  const required = options?.required || defaultRequiredOptions

  const numbersValidator = /[0-1]/
  const lowerCaseValidator = /[a-z]/
  const upperCaseValidator = /[A-Z]/
  const specialCharsValidator = /[!@#$%&*()\-_=+§`´\[\]{}^~º,<.>:;?°\'"\\]/
  
  if(password.length < minLenght) {
    return false
  }
  if(maxLenght && (password.length > maxLenght)) {
    return false
  }

  let lowerCase = 0
  let upperCase = 0
  let numbers = 0
  let specialChars = 0

  for(let i = 0; i < password.length; i++) {
    if(required.lowerCase && lowerCaseValidator.test(password[i])) {
      lowerCase++
    }
    if(required.upperCase && upperCaseValidator.test(password[i])) {
      upperCase++
    }
    if(required.numbers && numbersValidator.test(password[i])) {
      numbers++
    }
    if(required.specialChars && specialCharsValidator.test(password[i])) {
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