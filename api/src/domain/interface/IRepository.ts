type statusResponse = {
  status: 200 | 500 | 404
}

export interface IRepository<Entity> {
  getMany(): Promise<Entity[]>
  getOne(id: string): Promise<Entity>
  create(entity: Entity): Promise<Entity>
  updateOne(id: string, entity: Partial<Entity>): Promise<void>
  deleteOne(id: string): Promise<void>
}