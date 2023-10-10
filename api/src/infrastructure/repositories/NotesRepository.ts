import { pick } from "lodash"
import { Like } from "typeorm"

import { TypeORMBaseRepository } from "./typeorm"
import { NoteModel } from "./typeorm/models/NoteModel"

import { 
  deleteOneResponse, 
  getManyOptions, 
  getManyResponse, 
  INotesRepository, 
  updateOneResponse,
  getManyOptionsFilter
 } from "../shared/interface"

export class NotesRepository extends TypeORMBaseRepository implements INotesRepository<NoteModel> {
  async getMany({ filters, limit, skip }: getManyOptions): Promise<getManyResponse<NoteModel>> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(NoteModel)

    if (filters.search) {
      const searchWords: string[] = filters.search.trim().split(" ")
      const conditions = searchWords
        .map((word) => {
          if (word.includes(" ") || word.length < 1) {
              return
          }
          return Like(`%${word}%`)
        })
        .filter((like) => (like ? true : false))

      const searchFilters = [
        ...conditions.map((condition) => ({ title: condition })),
        ...conditions.map((condition) => ({ content: condition })),
        {
          privacyStatus: "public"
        }
      ]

      const [results, total] = await repository
        .findAndCount({
          where: searchFilters,
          skip: skip,
          take: limit,
          order: {
            updatedAt: -1,
          },
        })

      return {
        results,
        total,
      }
    }

    const selectedFilters: getManyOptionsFilter = pick(filters, [
      "id",
      "noteSlug",
      "title",
      "content",
      "createdAt",
      "updatedAt",
      "author",
      "privacyStatus"
    ])

    const [results, total] = await repository.findAndCount({
      where: {
        ...selectedFilters
      },
      skip: skip,
      take: limit,
      order: {
        updatedAt: -1,
      },
    })

    return {
      total: total,
      results: results
    }
  }

  async getOneBySlug(noteSlug: string): Promise<NoteModel> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(NoteModel)

    const result = await repository.findOne({
      where: {
        noteSlug: noteSlug
      }
    })

    return result!
  }

  async getOneById(id: string): Promise<NoteModel> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(NoteModel)

    const result = await repository.findOne({
      where: {
        id: id
      }
    })

    return result!
  }

  async create(data: NoteModel): Promise<NoteModel> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(NoteModel)

    const entity = repository.create(data)
    const result = await repository.save(entity)

    return result
  }

  async updateOne(id: string, entity: Partial<NoteModel>): Promise<updateOneResponse> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(NoteModel)

    const { affected = 0 } = await repository.update(id, entity)

    return {
      updatedCount: affected
    }
  }

  async deleteOne(id: string): Promise<deleteOneResponse> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(NoteModel)

    const { affected } = await repository.delete(id)

    return {
      deletedCount: affected || 0
    }
  }
}