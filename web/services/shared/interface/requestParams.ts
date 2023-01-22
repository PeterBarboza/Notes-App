export interface getManyParams {
  pagination?: {
    skip: number
    limit: number
  },
  search?: string
}

export interface authWithEmailAndPasswordParams {
  email: string
  password: string
}
