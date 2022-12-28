export function isValidPassword(password: string): boolean {
  const upperCaseLetters = /[A-Z]/
  const lowerCaseLetters = /[a-z]/
  const numbers = /[0-9]/
  const specialChars = /[!|@|#|$|%|^|&|*|(|)|-|_]/

  let upperCase = false
  let lowerCase = false
  let hasNumber = false
  let hasSpecialChars = false

  for(let i = 0; i < password.length; i++) {
    if(upperCaseLetters.test(password[i])) {
      upperCase = true
    }
    if(lowerCaseLetters.test(password[i])) {
      lowerCase = true
    }
    if(numbers.test(password[i])) {
      hasNumber = true
    }
    if(specialChars.test(password[i])) {
      hasSpecialChars = true
    }
  }

  if(upperCase) {
    if(lowerCase) {
      if(hasNumber) {
        if(hasSpecialChars) {
          return true
        }
      }
    }
  }
  
  return false
}