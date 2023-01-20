export function haveLettersVerify(text: string) {
  const lettersRegex = /[abcdefghijklmnopqrstuvwxyz]/gi
  const normalizeRegex = /[\u0300-\u036f]/g

  const normalizedText = text.normalize("NFD").replace(normalizeRegex, "")

  if(lettersRegex.test(normalizedText)) {
    return true
  }

  return false
}