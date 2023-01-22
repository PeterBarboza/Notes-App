import { ApiFactory } from "./api"

import { GetManyResponse, GetOneResponse } from "./shared/interface/responses"
import { getManyParams } from "./shared/interface/requestParams"
import { Note } from "../interface/schemas"

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

    return result.data
  }

  async getOne(noteSlug: string): Promise<GetOneResponse<Note>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<GetOneResponse<Note>>(
      `${this.basePath}/${noteSlug}`
    )

    return result.data
  }
}