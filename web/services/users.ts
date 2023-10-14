import { ApiFactory } from "./api"

import { User } from "../interface"

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
      `${this.basePath}/${username}/notes`
    )

    return result.data
  }
}