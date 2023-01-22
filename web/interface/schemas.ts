export interface Note {
  id: string
  noteSlug: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  author: User
  privacyStatus: string
}

export interface User {
  id: string
  username: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  notes: Note[]
}