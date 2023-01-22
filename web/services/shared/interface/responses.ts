export interface GetManyResponse<Entity> {
  results: Entity[]
  pagination: {
    total: number
    limit: number
    skip: number
  }
}

export type GetOneResponse<Entity> = Entity | null
