import { ApiFactory } from "./api"

import { GetManyResponse, GetOneResponse } from "./shared/interface/responses"
import type { createNoteData, fullUpdateNoteData, getManyParams } from "./shared/interface/requestParams"
import { Note } from "../interface/schemas"
import { EnsureAuthenticated } from "./shared/decorators/EnsureAuthenticated"

export class NotesService {
  private api: ApiFactory
  private basePath: string
  accessToken?: string

  constructor(api: ApiFactory) {
    this.api = api
    this.basePath = "/notes"
  }
  async getMany({ pagination, search = undefined }: getManyParams): Promise<GetManyResponse<Note>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<GetManyResponse<Note>>(
      this.basePath,
      {
        params: {
          pagination: pagination,
          filters: {
            search: search
          }
        }
      }
    )

    return result as any
  }

  @EnsureAuthenticated({ optional: true })
  async getOne(noteSlug: string): Promise<GetOneResponse<Note>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<GetOneResponse<Note>>(
      `${this.basePath}/${noteSlug}`
    )

    return result as any
  }

  @EnsureAuthenticated({})
  async create(noteData: createNoteData): Promise<GetOneResponse<Note>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.post<GetOneResponse<Note>>(
      this.basePath,
      noteData
    )

    return result as any
  }

  @EnsureAuthenticated({})
  async update(noteId: string, noteData: fullUpdateNoteData): Promise<GetOneResponse<Note>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.patch<GetOneResponse<Note>>(
      `${this.basePath}/${noteId}`,
      noteData
    )

    return result as any
  }
}