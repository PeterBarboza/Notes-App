import { generateRandomNumber } from "./generateRandomNumber"

type hasEqualSlugProps = {
  slugToVerify: string, 
  verifierFunction: (noteSlug: string) => unknown,
  initialSlug?: string
}

export async function hasEqualSlug({
  slugToVerify,
  verifierFunction,
  initialSlug = slugToVerify,
}: hasEqualSlugProps): Promise<string> {
  const hasEqual = await verifierFunction(slugToVerify)

  if(!hasEqual) {
    return slugToVerify
  }

  const newSlug = `${initialSlug}-${generateRandomNumber()}`

  return await hasEqualSlug({
    slugToVerify: newSlug, 
    verifierFunction: verifierFunction,
    initialSlug: initialSlug
  })
}