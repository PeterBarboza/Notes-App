import { ApiFactory } from "../api"
import { NotesService } from "../notes"
import { CONFIG } from "../../configs"

export class NotesServiceFactory {
  handle(accessToken?: string) {
    const apiFactory = new ApiFactory({ baseApiUrl: CONFIG.baseApiUrl, accessToken: accessToken })

    return new NotesService(apiFactory)
  }
}