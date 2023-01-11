export type getManyOptionsFilter = { [key: string]: unknown }

export type getManyOptions = {
  skip: number
  limit: number
  filters: {
    search?: string
    [key: string]: unknown
  }
}
export type getManyResponse<Entity> = {
  total: number
  results: Entity[]
}
export type updateOneResponse = {
  updatedCount: number
}
export type deleteOneResponse = {
  deletedCount: number
}

export interface ITokenPayload {
  sub: string
  username: string
  iat: number
  exp: number
}

export interface INotesRepository<Entity> {
  getMany(options: getManyOptions): Promise<getManyResponse<Entity>>
  getOneBySlug(id: string, userId?: string): Promise<Entity>
  getOneBySlugOnlyForVerification(id: string): Promise<Entity>
  getOneById(id: string): Promise<Entity>
  create(data: Entity): Promise<Entity>
  updateOne(id: string, entity: Partial<Entity>): Promise<updateOneResponse>
  deleteOne(id: string): Promise<deleteOneResponse>
}

export interface IUsersRepository<Entity> {
  getMany(options: getManyOptions): Promise<getManyResponse<Entity>>
  getOneByUsername(username: string): Promise<Entity>
  getOneByUsernameWithNotes(username: string, privacyStatus: string[]): Promise<Entity>
  getOneByEmail(email: string): Promise<Entity>
  getOneById(id: string): Promise<Entity>
  getOneByIdWithEmailAndPassword(id: string): Promise<Entity>
  getOneByEmailWithEmailAndPassword(email: string): Promise<Entity>
  create(data: Entity): Promise<Entity>
  updateOne(id: string, entity: Partial<Entity>): Promise<updateOneResponse>
  deleteOne(id: string): Promise<deleteOneResponse>
}