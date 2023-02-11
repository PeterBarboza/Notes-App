import axios, { AxiosInstance } from "axios"
import qs from "qs"

type apiFactoryConstructor = {
  baseApiUrl: string
  accessToken?: string
}

export class ApiFactory {
  private baseApiUrl: string
  private accessToken?: string
  private INSTANCE?: AxiosInstance

  constructor({ baseApiUrl, accessToken }: apiFactoryConstructor) {
    this.baseApiUrl = baseApiUrl
    this.accessToken = accessToken
  }

  getApiCaller(accessToken?: string): AxiosInstance {
    if(accessToken) this.accessToken = accessToken

    if(!this.INSTANCE || accessToken) {
      const instance = axios.create({
        baseURL: this.baseApiUrl,
        headers: {
          authorization: this.accessToken ? `Bearer ${this.accessToken}` : undefined
        },
        paramsSerializer: {
          serialize: (params) => qs.stringify(params)
        },
        validateStatus: function (status) {
          return status < 500; // Resolve somente se o código de status for menor que 500
        }
      })

      this.INSTANCE = instance
    }

    return this.INSTANCE!
  }
}
