import { Note } from "./Note"

export class User {
  id?: string
  username?: string
  email!: string
  password!: string
  createdAt?: Date
  updatedAt?: Date
  notes?: Note[]
}