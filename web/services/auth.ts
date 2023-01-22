import { ApiFactory } from "./api"

export class AuthService {
  private api: ApiFactory
  private basePath: string

  constructor(api: ApiFactory) {
    this.api = api
    this.basePath = "/auth"
  }

  async authWithRefreshToken(refreshToken: string) {
    const apiCaller = this.api.getApiCaller()

    const result = await apiCaller.post(`${this.basePath}/rt`, { refreshToken: refreshToken })

    return result
  }

  async authWithEmailAndPassword(email: string, password: string) {
    const apiCaller = this.api.getApiCaller()

    const result = await apiCaller.post(this.basePath, { email, password })

    return result
  }
}