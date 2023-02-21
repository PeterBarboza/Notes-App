import { v4 as uuid } from "uuid"
import slug from "slug"

import { Note } from "../entities/Note"
import { hasEqualSlug } from "../../infrastructure/shared/utils/hasEqualSlug"
import { NotFoundError, AmmountAffectedError } from "../../errors"

import { 
  INotesRepository, 
  getManyOptions, 
  getManyResponse, 
  updateOneResponse, 
  deleteOneResponse,
 } from "../../infrastructure/shared/interface"

export class NoteServices {
  private repository: INotesRepository<Note>

  constructor(repository: INotesRepository<Note>) {
    this.repository = repository
  }

  async getPublicFeed({ limit, skip, filters, select }: getManyOptions): Promise<getManyResponse<Note>> {
    return await this.repository.getMany({ limit, skip, filters, select })
  }

  async getOneBySlug(noteSlug: string, userId?: string): Promise<Note> {
    const note = await this.repository.getOneBySlug(noteSlug, userId)

    if(!note) throw new NotFoundError({ entityName: "Note" })

    return note
  }

  async getOneById(id: string): Promise<Note> {
    const note = await this.repository.getOneById(id)

    if(!note) throw new NotFoundError({ entityName: "Note" })

    return note
  }

  async create(entity: Note): Promise<Note> {
    const noteSlug = await hasEqualSlug({
      slugToVerify: slug(entity.title.trim()),
      verifierFunction: this.repository.getOneBySlugOnlyForVerification.bind(this.repository)
    })

    const parsedEntity: Note = {
      id: uuid(),
      noteSlug: noteSlug,
      title: entity.title.trim(),
      author: entity.author,
      content: entity.content.trim(),
      privacyStatus: entity.privacyStatus
    }

    return await this.repository.create(parsedEntity)
  }

  async updateOne(id: string, entity: Partial<Note>): Promise<updateOneResponse> {
    const note = await this.repository.getOneById(id)

    if(!note) throw new NotFoundError({ entityName: "Note" })

    if(entity.content) entity.content = entity.content.trim()

    const hasTitleChanges = entity.title && !(entity.title === note.title) ? true : false
    
    if(hasTitleChanges) {
      const noteSlug = await hasEqualSlug({
        slugToVerify: slug((entity.title!).trim()),
        verifierFunction: this.repository.getOneBySlugOnlyForVerification.bind(this.repository)
      })

      const { updatedCount } = await this.repository.updateOne(id, { ...entity, noteSlug })

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