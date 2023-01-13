
export function formatNoteSlug(title: string): string {
  const wordsArray = title.trim().toLowerCase().split(" ")
  const specialCharsValidator = /[!@#$%&*()\-_=+§`´\[\]{}^~º,<.>:;?°\'"\\/]/

  const noteSlug = wordsArray
  .map((word) => {
    const isBlankText = word.includes(" ") || word.length < 1
    if(isBlankText) return

    let validChars = ""

    for(let i = 0; i < word.length; i++) {
      if(!specialCharsValidator.test(word[i])) validChars += word[i]
    }

    return validChars
  })
  .filter((word) => {
    if(word) {
      return true
    }
    return false
  }) 
  .join("-")

  return noteSlug
}