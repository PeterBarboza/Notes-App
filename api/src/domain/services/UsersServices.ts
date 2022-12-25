import { hash } from "bcryptjs"
import { v4 as uuid } from "uuid"

import { CONFIG } from "../../configs"

import { User } from "../entities/User"

//TODO: Criar interface do repositrório de usuário
export class UserServices {
  private repository: any

  constructor(repository: any) {
    this.repository = repository
  }

  async getMany(): Promise<User[]> {
    return await this.repository.getMany()
  }

  async getOne(id: string): Promise<User> {
    return await this.repository.getOne(id)
  }

  async create(entity: User): Promise<User> {
    const { password } = entity

    const parsedPassword = await hash(password, CONFIG.passwordHashSalt)

    const parsedEntity: User = {
      ...entity,
      id: uuid(),
      password: parsedPassword
    }

    return await this.repository.create(parsedEntity)
  }

  async updateOne(id: string, entity: Partial<User>): Promise<void> {
    await this.repository.updateOne(id, entity)
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.deleteOne(id)
  }
}