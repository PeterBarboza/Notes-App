
export function isValidUsername(username: string): boolean {
  const regexValidator = /[a-z0-1\-_.]/gi
  const lettersValidation = /[a-zA-z]/gi

  const parsedUsername = username.trim()

  if(!parsedUsername || parsedUsername.length < 2) {
    return false
  }

  let letters = 0

  for(let i = 0; i < parsedUsername.length; i++) {
    if(lettersValidation.test(parsedUsername[i])) {
      letters++
    }
  }

  if(letters < 2) {
    return false
  }

  if(regexValidator.test(parsedUsername)) {
    return true
  }

  return false
}