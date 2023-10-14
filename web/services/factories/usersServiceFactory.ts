import { ApiFactory } from "../api"
import { CONFIG } from "../../configs"
import { UsersService } from "../users"

export class UsersServiceFactory {
  handle(accessToken?: string) {
    const apiFactory = new ApiFactory({ baseApiUrl: CONFIG.baseApiUrl, accessToken: accessToken })

    return new UsersService(apiFactory)
  }
}