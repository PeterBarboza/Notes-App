import { ApiFactory } from "./api"

import { User } from "../interface/schemas"
import { GetOneResponse } from "./shared/interface/responses"

//TODO: Trocar o retorno dos métodos para retornar toda a resposta do Axios
//pois isso sera usado nos middlewares/decorators que verificaram a validade
//do token do usuário para realizar o refreshToken caso necessário. 
export class UsersService {
  private api: ApiFactory
  private basePath: string
  accessToken?: string

  constructor(api: ApiFactory) {
    this.api = api
    this.basePath = "/users"
  }

  async getOneWithNotes(username: string): Promise<GetOneResponse<User>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<User>(
      `${this.basePath}/username/${username}/notes`
    )

    return result.data
  }

  async getOneByUsername(username: string): Promise<GetOneResponse<User>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<User>(
      `${this.basePath}/username/${username}`
    )

    return result.data
  }

  async getOneById(id: string): Promise<GetOneResponse<User>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<User>(
      `${this.basePath}/id/${id}`
    )

    return result.data
  }
}