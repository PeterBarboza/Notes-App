import { AxiosResponse } from "axios"

import { ApiFactory } from "./api"

import { User } from "../interface/schemas"
import { DeleteResponse, GetOneResponse, UpdateResponse } from "./shared/interface/responses"
import { createAccountParams, deleteAccountParams, updateEmailParams, updatePasswordParams, updateProfileParams } from "./shared/interface/requestParams"

export class UsersService {
  private api: ApiFactory
  private basePath: string
  accessToken?: string

  constructor(api: ApiFactory) {
    this.api = api
    this.basePath = "/users"
  }

  async getOneWithNotes(username: string): Promise<AxiosResponse<GetOneResponse<User>>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<User>(
      `${this.basePath}/username/${username}/notes`
    )

    return result
  }

  async getOneByUsername(username: string): Promise<AxiosResponse<GetOneResponse<User>>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<User>(
      `${this.basePath}/username/${username}`
    )

    return result
  }

  async getOneById(id: string): Promise<AxiosResponse<GetOneResponse<User>>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.get<User>(
      `${this.basePath}/id/${id}`
    )

    return result
  }

  async create(userData: createAccountParams): Promise<AxiosResponse<GetOneResponse<User>>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.post<User, any, createAccountParams>(
      `${this.basePath}`,
      userData
    )

    return result
  }

  async updateOne(id: string, userData: Partial<updateProfileParams>): 
    Promise<AxiosResponse<UpdateResponse>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.patch
      <
        User, 
        AxiosResponse<UpdateResponse>, 
        Partial<updateProfileParams>
      >(
      `${this.basePath}/${id}`,
      userData
    )

    return result
  }

  async updateEmail(id: string, userData: updateEmailParams): Promise<AxiosResponse<UpdateResponse>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.patch
      <
        UpdateResponse, 
        AxiosResponse<UpdateResponse>, 
        updateEmailParams
      >
    (
      `${this.basePath}/${id}/email`,
      userData
    )

    return result
  }

  async updatePassword(id: string, userData: updatePasswordParams): Promise<AxiosResponse<UpdateResponse>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.patch
      <
        UpdateResponse, 
        AxiosResponse<UpdateResponse>, 
        updatePasswordParams
      >
    (
      `${this.basePath}/${id}/password`,
      userData
    )

    return result
  }

  async deleteAccount(id: string, authData: deleteAccountParams): Promise<AxiosResponse<DeleteResponse>> {
    const apiCaller = this.api.getApiCaller(this.accessToken)

    const result = await apiCaller.post
      <
        DeleteResponse, 
        AxiosResponse<DeleteResponse>, 
        deleteAccountParams
      >
    (
      `${this.basePath}/${id}`,
      authData
    )

    return result
  }
}