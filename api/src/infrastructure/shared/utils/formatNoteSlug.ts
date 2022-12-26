export function formatNoteSlug(title: string): string {
  const wordsArray = title.trim().toLowerCase().split(" ")

  const noteSlug = wordsArray
  .map((word) => {
    const isBlankText = word.includes(" ") || word.length < 1

    if(isBlankText) {
      return
    }

    return word
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