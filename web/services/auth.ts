import { AxiosResponse } from "axios"
import { ApiFactory } from "./api"

import { AuthResponse } from "./shared/interface/responses"

export class AuthService {
  private api: ApiFactory
  private basePath: string

  constructor(api: ApiFactory) {
    this.api = api
    this.basePath = "/auth"
  }

  async authWithRefreshToken(refreshToken: string): Promise<AxiosResponse<AuthResponse>> {
    const apiCaller = this.api.getApiCaller()

    const result = await apiCaller.post<AuthResponse>(
      `${this.basePath}/rt`, 
      { 
        refreshToken: refreshToken,
      }
    )

    return result
  }

  async authWithEmailAndPassword(
    email: string, 
    password: string, 
  ): Promise<AxiosResponse<AuthResponse>> {
    const apiCaller = this.api.getApiCaller()

    const result = await apiCaller.post<AuthResponse>(
      this.basePath, 
      { 
        email, 
        password, 
      }
    )

    return result
  }
}