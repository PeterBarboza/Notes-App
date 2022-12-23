import { User } from "./User"

export class Note {
  id?: string
  noteSlug?: string
  title!: string
  content!: string
  createdAt?: Date
  updatedAt?: Date
  author!: User
  privacyStatus!: string
}