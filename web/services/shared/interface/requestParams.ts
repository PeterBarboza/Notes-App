export interface getManyParams {
  pagination?: {
    skip?: number
    limit?: number
  },
  filters?: {
    search?: string
    [key: string]: any
  },
  select?: string[]
}

export interface authWithEmailAndPasswordParams {
  email: string
  password: string
}

export interface createAccountParams {
  email: string
  username: string
  password: string
}

export interface updateProfileParams {
  username: string
}

export interface createNoteData {
  title: string
  content: string
  author: string
  privacyStatus: "public" | "private"
}

export interface fullUpdateNoteData {
  title: string
  content: string
  privacyStatus: "public" | "private"
  author: string
}
