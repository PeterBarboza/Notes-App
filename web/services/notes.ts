import { ApiFactory } from "./api"

import { GetManyResponse, GetOneResponse } from "./shared/interface"
import { Note } from "../interface"

type paginationParams = {
  limit?: number
  skip?: number
}
type searchParams = {
  paginationParams?: paginationParams
  keyWords?: string
}

export class NotesService {
  private api: ApiFactory
  private basePath: string
  accessToken?: string

  constructor(api: ApiFactory) {
    this.api = api
    this.basePath = "/notes"
  }

  async getMany({ paginationParams, keyWords = undefined }: searchParams): Promise<GetManyResponse<Note>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<GetManyResponse<Note>>(
      this.basePath,
      {
        params: {
          pagination: {
            limit: paginationParams?.limit,
            skip: paginationParams?.skip
          },
          filters: {
            search: keyWords
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