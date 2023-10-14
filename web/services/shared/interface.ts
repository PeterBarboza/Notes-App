export interface GetManyResponse<Entity> {
  results: Entity[]
  pagination: {
    total: number
    limit: number
    skip: number
  }
}

export interface getManyParams {
  pagination?: {
    skip: number
    limit: number
  },
  search?: string
}

export type GetOneResponse<Entity> = Entity | null
