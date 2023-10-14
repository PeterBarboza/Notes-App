import { ApiFactory } from "../api"
import { AuthService } from "../auth"
import { CONFIG } from "../../configs"

export class AuthServiceFactory {
  handle(accessToken?: string) {
    const apiFactory = new ApiFactory({ baseApiUrl: CONFIG.baseApiUrl, accessToken: accessToken })

    return new AuthService(apiFactory)
  }
}