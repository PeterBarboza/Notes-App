import { AxiosResponse } from "axios"

import { ApiFactory } from "./api"

import { GetManyResponse, GetOneResponse } from "./shared/interface/responses"
import type { createNoteData, fullUpdateNoteData, getManyParams } from "./shared/interface/requestParams"
import { Note } from "../interface/schemas"

export class NotesService {
  private api: ApiFactory
  private basePath: string
  accessToken?: string

  constructor(api: ApiFactory) {
    this.api = api
    this.basePath = "/notes"
  }
  async getMany(params: getManyParams)
    : Promise<AxiosResponse<GetManyResponse<Note>>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<GetManyResponse<Note>>(
      this.basePath,
      {
        params: {
          pagination: params?.pagination,
          filters: params?.filters
        }
      }
    )

    return result
  }

  async getOne(noteSlug: string): Promise<AxiosResponse<GetOneResponse<Note>>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<GetOneResponse<Note>>(
      `${this.basePath}/${noteSlug}`
    )

    return result
  }

  async create(noteData: createNoteData)
    : Promise<AxiosResponse<GetOneResponse<Note>>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.post<GetOneResponse<Note>>(
      this.basePath,
      noteData
    )

    return result
  }

  async update(noteId: string, noteData: fullUpdateNoteData)
    : Promise<AxiosResponse<GetOneResponse<Note>>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.patch<GetOneResponse<Note>>(
      `${this.basePath}/${noteId}`,
      noteData
    )

    return result
  }

  async delete(noteId: string)
    : Promise<AxiosResponse<GetOneResponse<Note>>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.delete<GetOneResponse<Note>>(
      `${this.basePath}/${noteId}`,
    )

    return result
  }
}
