import { v4 as uuid } from "uuid"

import { Note } from "../entities/Note"
import { formatNoteSlug } from "../../infrastructure/shared/utils/formatNoteSlug"
import { hasEqualSlug } from "../../infrastructure/shared/utils/hasEqualSlug"
import { GenericError, NotFoundError, AmmountAffectedError } from "../../errors"

import { 
  INotesRepository, 
  getManyOptions, 
  getManyResponse, 
  updateOneResponse, 
  deleteOneResponse
 } from "../../infrastructure/shared/interface"

export class NoteServices {
  private repository: INotesRepository<Note>

  constructor(repository: INotesRepository<Note>) {
    this.repository = repository
  }

  async getMany(options: getManyOptions): Promise<getManyResponse<Note>> {
    return await this.repository.getMany(options)
  }

  async getOne(noteSlug: string): Promise<Note> {
    const note = await this.repository.getOneBySlug(noteSlug)

    if(!note) throw new NotFoundError({ entityName: "Note" })

    return note
  }

  async create(entity: Note): Promise<Note> {
    const noteSlug = await hasEqualSlug({
      slugToVerify: formatNoteSlug(entity.title),
      verifierFunction: this.repository.getOneBySlug
    })

    const parsedEntity: Note = {
      ...entity,
      id: uuid(),
      noteSlug: noteSlug,
    }

    return await this.repository.create(parsedEntity)
  }

  async updateOne(id: string, entity: Partial<Note>): Promise<updateOneResponse> {
    const note = await this.repository.getOneById(id)

    if(!note) throw new NotFoundError({ entityName: "Note" })

    const hasTitleChanges = entity.title && !(entity.title === note.title) ? true : false

    if(hasTitleChanges) {
      const noteSlug = await hasEqualSlug({
        slugToVerify: formatNoteSlug(entity.title!),
        verifierFunction: this.repository.getOneBySlug
      })

      const { updatedCount } = await this.repository.updateOne(id, { ...entity, noteSlug })

      if(updatedCount < 1) throw new GenericError({ message: "Note not affected" })

      return {
        updatedCount
      }
    }

    const { updatedCount } = await this.repository.updateOne(id, entity)

    if(updatedCount != 1) {
      throw new AmmountAffectedError({ 
        entityName: "Note",
        shouldBeAffect: 1,
        wasAffected: updatedCount,
      })
    }

    return {
      updatedCount
    }
  }

  async deleteOne(id: string): Promise<deleteOneResponse> {
    const hasEntity = await this.repository.getOneById(id)

    if(!hasEntity) throw new NotFoundError({ entityName: "Note" })

    const { deletedCount } = await this.repository.deleteOne(id)

    if(deletedCount != 1) {
      throw new AmmountAffectedError({ 
        entityName: "Note",
        shouldBeAffect: 1,
        wasAffected: deletedCount,
      })
    }

    return {
      deletedCount
    }
  }
}