import { hash } from "bcryptjs"
import { v4 as uuid } from "uuid"

import { CONFIG } from "../../configs"

import { User } from "domain/entities/User"
import { IRepository } from "domain/interface/IRepository"

export class UserServices {
  private repository: IRepository<User>

  constructor(repository: IRepository<User>) {
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