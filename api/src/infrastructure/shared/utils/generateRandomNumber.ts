export function generateRandomNumber(): number {
  const min = 100000000
  const max = 999999999

  const number = 
    Math.floor(
      Math.random() * (max - min + 1)
    ) + min

  return number
}

console.log(generateRandomNumber())