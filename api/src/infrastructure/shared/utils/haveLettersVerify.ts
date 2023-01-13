export function haveLettersVerify(text: string) {
  const upperCase = /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/
  const lowerCase = /[abcdefghijklmnopqrstuvwxyz]/

  if(upperCase.test(text) || lowerCase.test(text)) {
    return true
  }

  return false
}