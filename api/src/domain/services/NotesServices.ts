import { v4 as uuid } from "uuid"

import { Note } from "domain/entities/Note"
import { IRepository } from "domain/interface/IRepository"

export class NoteServices {
  private repository: IRepository<Note>

  constructor(repository: IRepository<Note>) {
    this.repository = repository
  }

  async getMany(): Promise<Note[]> {
    return await this.repository.getMany()
  }

  async getOne(id: string): Promise<Note> {
    return await this.repository.getOne(id)
  }

  async create(entity: Note): Promise<Note> {
    const parsedEntity: Note = {
      ...entity,
      id: uuid(),
    }

    return await this.repository.create(parsedEntity)
  }

  async updateOne(id: string, entity: Partial<Note>): Promise<void> {
    await this.repository.updateOne(id, entity)
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.deleteOne(id)
  }
}