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

export interface INotesRepository<Entity> {
  getMany(options: getManyOptions): Promise<getManyResponse<Entity>>
  getOneBySlug(id: string): Promise<Entity>
  getOneById(id: string): Promise<Entity>
  create(entity: Entity): Promise<Entity>
  updateOne(id: string, entity: Partial<Entity>): Promise<updateOneResponse>
  deleteOne(id: string): Promise<deleteOneResponse>
}