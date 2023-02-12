export interface getManyParams {
  pagination?: {
    skip?: number
    limit?: number
  },
  search?: string
}

export interface authWithEmailAndPasswordParams {
  email: string
  password: string
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
