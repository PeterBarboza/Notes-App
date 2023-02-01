import { UserPublicData } from "./entitiesResponseData"

export interface GetManyResponse<Entity> {
  results: Entity[]
  pagination: {
    total: number
    limit: number
    skip: number
  }
}

export type GetOneResponse<Entity> = Entity | null

export type AuthResponse = {
  accessToken: string
  refreshToken: string
  user: UserPublicData
}
