import { hash, compareSync } from "bcryptjs"
import { v4 as uuid } from "uuid"
import { sign } from "jsonwebtoken"

import { User } from "../entities/User"
import { isValidPassword } from "../../infrastructure/shared/utils/isValidPassword"
import { AmmountAffectedError,
  NotFoundError,
  UnauthorizedError,
  GenericError
} from "../../errors"
import { CONFIG } from "../../configs"

import { 
  deleteOneResponse, 
  getManyOptions, 
  getManyResponse, 
  IUsersRepository, 
  updateOneResponse
 } from "../../infrastructure/shared/interface"
import { isValidUsername } from "../../infrastructure/shared/utils/isValidUsername"

type updateUserParams = {
  username: string
}
type updateEmailParams = {
  email: string
  password: string
}
type updatePasswordParams = {
  newPassword: string
  oldPassword: string
}
type authUserparams = {
  email: string
  password: string
}

//TODO: Adicionar filtro na função getOneByusername() para conseguir trazer
//uma nota específica através de seu slug junto do usuário.
//PROVALVEMENTE vou fazer o lance acima através dos serviços de notas
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

    if(!isValidUsername(entity.username)) {
      throw new GenericError({
        message: "Invalid username. Username must have at least 2 characteres length and 2 letters. You can use uppercase and lowercase letters, numbers and the following special characters: [\"hifen(-)\", \"underline(_)\", \"dot(.)\"]"
      })
    }

    const isUsernameAlreadyInUse = await this.repository.getOneByUsername(entity.username)
    if(isUsernameAlreadyInUse) throw new GenericError({ message: "Email already in use" })

    const isEmailAlreadyInUse = await this.repository.getOneByEmail(entity.email)
    if(isEmailAlreadyInUse) throw new GenericError({ message: "Username already in use" })
    
    if(!isValidPassword(entity.password)) {
      throw new GenericError({
        message: "Invalid password. Password must have at least 8 characteres length, 1 special character, 1 uppercase letter and 1 lower case letter"
      })
    }

    const parsedPassword = await hash(password, 10)

    const parsedEntity: User = {
      ...entity,
      id: uuid(),
      password: parsedPassword
    }

    return await this.repository.create(parsedEntity)
  }

  async updateOne(id: string, entity: updateUserParams): Promise<updateOneResponse> {
    const user = await this.repository.getOneById(id)
    if(!user) throw new NotFoundError({ entityName: "User" })
    
    if(!isValidUsername(entity.username)) {
      throw new GenericError({
        message: "Invalid username. Username must have at least 2 characteres length and 2 letters. You can use uppercase and lowercase letters, numbers and the following special characters: [\"hifen(-)\", \"underline(_)\", \"dot(.)\"]"
      })
    }

    const hasEqual = await this.repository.getOneByUsername(entity.username)
    if(hasEqual) throw new GenericError({ message: "Username already in use" })

    const { updatedCount } = await this.repository.updateOne(id, { username: entity.username })

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

  async updateEmail(id: string, entity: updateEmailParams): Promise<updateOneResponse> {
    const user = await this.repository.getOneByIdWithPassword(id)
    if(!user) throw new NotFoundError({ entityName: "User" })
    
    const passwordMatch = compareSync(entity.password!, user.password)
    if(!passwordMatch) {
      throw new UnauthorizedError({ 
        substituteMessage: "Incorrect password" 
      })
    }
    
    if(user.email === entity.email) {
      throw new GenericError({ message: "The new and old emails are equal" })
    }

    const hasEqual = await this.repository.getOneByEmail(entity.email)
    if(hasEqual) throw new GenericError({ message: "Email already in use" })

    const { updatedCount } = await this.repository.updateOne(id, { email: entity.email })

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

  async updatePassword(id: string, entity: updatePasswordParams): Promise<updateOneResponse> {
    const user = await this.repository.getOneByIdWithPassword(id)
    if(!user) throw new NotFoundError({ entityName: "User" })
    
    const passwordMatch = compareSync(entity.oldPassword!, user.password)
    if(!passwordMatch) {
      throw new UnauthorizedError({ 
        substituteMessage: "Incorrect password" 
      })
    }
    if(entity.newPassword === entity.oldPassword) {
      throw new GenericError({ 
        message: "The new and old passwords are equal"
      })
    }

    if(!isValidPassword(entity.newPassword)) {
      throw new GenericError({
        message: "Invalid password. Password must have at least 8 characteres length, 1 special character, 1 uppercase letter and 1 lower case letter"
      })
    }

    const parsedPassword = await hash(entity.newPassword, 10)

    const { updatedCount } = await this.repository.updateOne(id, { password: parsedPassword })

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

  async authUser({ email, password }: authUserparams) {
    const user = await this.repository.getOneByEmailWithPassword(email)
    if(!user) throw new UnauthorizedError({ substituteMessage: "Email or password incorrect" })

    const passwordMatch = compareSync(password, user.password)
    if(!passwordMatch) throw new UnauthorizedError({ substituteMessage: "Email or password incorrect" })

    const token = sign({}, CONFIG.jwtSecret, {
      subject: user.id,
      expiresIn: "20s"
    })

    return { token }
  }
}