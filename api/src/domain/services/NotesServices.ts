import { v4 as uuid } from "uuid"

import { Note } from "../entities/Note"
import { INotesRepository, getManyOptions, getManyResponse, updateOneResponse, deleteOneResponse } from "../../infrastructure/shared/interface"

export class NoteServices {
  private repository: INotesRepository<Note>

  constructor(repository: INotesRepository<Note>) {
    this.repository = repository
  }

  async getMany(options: getManyOptions): Promise<getManyResponse<Note>> {
    return await this.repository.getMany(options)
  }

  async getOne(noteSlug: string): Promise<Note> {
    return await this.repository.getOneBySlug(noteSlug)
  }

  async create(entity: Note): Promise<Note> {
    const parsedEntity: Note = {
      ...entity,
      id: uuid(),
    }

    return await this.repository.create(parsedEntity)
  }

  //TODO: Criar erros personalizdos e os tratamento corretos
  async updateOne(id: string, entity: Partial<Note>): Promise<updateOneResponse> {
    const hasEntity = await this.repository.getOneById(id)

    if(!hasEntity) {
      throw new Error("Not found")
    }

    return await this.repository.updateOne(id, entity)
  }

  async deleteOne(id: string): Promise<deleteOneResponse> {
    const hasEntity = await this.repository.getOneById(id)

    if(!hasEntity) {
      throw new Error("Not found")
    }

    return await this.repository.deleteOne(id)
  }
}