export interface GetManyResponse<Entity> {
  results: Entity[]
  pagination: {
    total: number
    skip: number
    limit: number
  }
}

export type GetOneResponse<Entity> = Entity | null
