import { ApiFactory } from "./api"

import { User } from "../interface/schemas"
import { GetOneResponse } from "./shared/interface/responses"

export class UsersService {
  private api: ApiFactory
  private basePath: string
  accessToken?: string

  constructor(api: ApiFactory) {
    this.api = api
    this.basePath = "/users"
  }

  async getOneWithNotes(username: string): Promise<User> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<User>(
      `${this.basePath}/username/${username}/notes`
    )

    return result.data
  }

  async getOneByUsername(username: string): Promise<User> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<User>(
      `${this.basePath}/username/${username}`
    )

    return result.data
  }

  async getOneById(id: string): Promise<User> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<User>(
      `${this.basePath}/id/${id}`
    )

    return result.data
  }
}