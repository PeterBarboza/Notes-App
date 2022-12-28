import { hash, compareSync } from "bcryptjs"
import { v4 as uuid } from "uuid"

import { CONFIG } from "../../configs"
import { User } from "../entities/User"
import { AmmountAffectedError,
  EmailAlreadyInUseError,
  NotFoundError,
  UsernameAlreadyInUseError,
  UnauthorizedError
} from "../../errors"

import { 
  deleteOneResponse, 
  getManyOptions, 
  getManyResponse, 
  IUsersRepository, 
  updateOneResponse
 } from "../../infrastructure/shared/interface"
import { pick } from "lodash"

type updateUserParams = {
  username?: string
  email?: string
  newPassword?: string
  oldPassword?: string
}

//TODO: Adicionar filtro na função getOneByusername() para conseguir trazer
//uma nota específica através de seu slug junto do usuário.

//TODO: Separar os fluxos de atualizar usuário e mudar senha em dois fluxo separados

//TODO: Criar validação para o nome dos usuários (Permitir apenas, letras, números e
//alguns caracteres especias que não atrapalhem nas URLs)
export class UserServices {
  private repository: IUsersRepository<User>

  constructor(repository: IUsersRepository<User>) {
    this.repository = repository
  }

  async getMany(options: getManyOptions): Promise<getManyResponse<User>> {
    return await this.repository.getMany(options)
  }

  async getOne(username: string): Promise<User> {
    const user = await this.repository.getOneByUsername(username)

    if(!user) throw new NotFoundError({ entityName: "User" })

    return user
  }

  async create(entity: User): Promise<User> {
    const { password } = entity

    const isUsernameAlreadyInUse = await this.repository.getOneByUsername(entity.username)
    if(isUsernameAlreadyInUse) throw new UsernameAlreadyInUseError({})

    const isEmailAlreadyInUse = await this.repository.getOneByEmail(entity.email)
    if(isEmailAlreadyInUse) throw new EmailAlreadyInUseError({})
    
    const parsedPassword = await hash(password, 10)

    const parsedEntity: User = {
      ...entity,
      id: uuid(),
      password: parsedPassword
    }

    return await this.repository.create(parsedEntity)
  }

  async updateOne(id: string, entity: updateUserParams): Promise<updateOneResponse> {
    const user = await this.repository.getOneByIdWithPassword(id)

    if(!user) throw new NotFoundError({ entityName: "User" })
    
    const passwordUpdateFlux = !!(entity.newPassword && entity.oldPassword)

    if(passwordUpdateFlux) {
      const isPasswordCorrect = compareSync(entity.oldPassword!, user.password)

      if(!isPasswordCorrect) {
        throw new UnauthorizedError({ 
          entityName: "User", 
          substituteMessage: "Incorrect password" 
        })
      }

      const updateData: Partial<User> = pick(entity, [
        "username",
        "email",
      ])

      const parsedPassword = await hash(entity.newPassword!, 10)

      Object.assign(updateData, { password: parsedPassword })

      const { updatedCount } = await this.repository.updateOne(id, updateData)

      if(updatedCount != 1) {
        throw new AmmountAffectedError({ 
          entityName: "User",
          shouldBeAffect: 1,
          wasAffected: updatedCount,
        })
      }

      return {
        updatedCount
      }
    }
    
    const updateData: Partial<User> = pick(entity, [
      "username",
      "email",
    ])

    const { updatedCount } = await this.repository.updateOne(id, updateData)

    if(updatedCount != 1) {
      throw new AmmountAffectedError({ 
        entityName: "User",
        shouldBeAffect: 1,
        wasAffected: updatedCount,
      })
    }

    return {
      updatedCount
    }
  }

  async deleteOne(id: string): Promise<deleteOneResponse>  {
    const hasUser = await this.repository.getOneById(id)

    if(!hasUser) throw new NotFoundError({ entityName: "User" })

    const { deletedCount } = await this.repository.deleteOne(id)

    if(deletedCount != 1) {
      throw new AmmountAffectedError({ 
        entityName: "User",
        shouldBeAffect: 1,
        wasAffected: deletedCount,
      })
    }

    return {
      deletedCount
    }
  }
}