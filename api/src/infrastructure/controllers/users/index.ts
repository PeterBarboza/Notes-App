import { Request, Response } from "express"
import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"

import { UserServices } from "../../../domain/services/UsersServices"
import { CreateUserDTO } from "./dto/CreateUserDTO"
import { UpdateUserDTO } from "./dto/UpdateUserDTO"
import { UnauthorizedError, ValidationError } from "../../../errors"
import { ExceptionsWrapper } from "../../middlewares/errorHandler"
import { UpdateEmailDTO } from "./dto/UpdateEmailDTO"
import { UpdatePasswordDTO } from "./dto/UpdatePasswordDTO"
import { AuthUserDTO } from "./dto/AuthUserDTO"

export class UsersController {
  services: UserServices

  constructor(services: UserServices) {
    this.services = services
  }

  @ExceptionsWrapper()
  async getMany(req: Request, res: Response): Promise<Response> {
    const { pagination, filters = {} } = req.query
    const limit = pagination?.limit as number
    const skip = pagination?.skip as number

    const { results, total } = await this.services.getMany({ limit, skip, filters })

    return res.json({
      pagination: {
        total,
        limit,
        skip
      },
      results
    })
  }

  @ExceptionsWrapper()
  async getOne(req: Request, res: Response): Promise<Response> {
    const { username } = req.params

    const response = await this.services.getOne(username)

    return res.json(response)
  }

  @ExceptionsWrapper()
  async create(req: Request, res: Response): Promise<Response> {
    const entity = plainToInstance(CreateUserDTO, req.body)
    
    const errors = await validate(entity)
    if (errors.length > 0) throw new ValidationError(errors)

    const response = await this.services.create(entity)

    return res.json(response)
  }

  @ExceptionsWrapper()
  async updateOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const entity = plainToInstance(UpdateUserDTO, req.body)

    const errors = await validate(entity)
    if (errors.length > 0) throw new ValidationError(errors)

    const { updatedCount } = await this.services.updateOne(id, entity)

    return res.json({ updatedCount })
  }

  @ExceptionsWrapper()
  async updateEmail(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const entity = plainToInstance(UpdateEmailDTO, req.body)

    const errors = await validate(entity)
    if (errors.length > 0) throw new ValidationError(errors)

    const { updatedCount } = await this.services.updateEmail(id, entity)

    return res.json({ updatedCount })
  }
  
  @ExceptionsWrapper()
  async updatePassword(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const entity = plainToInstance(UpdatePasswordDTO, req.body)

    const errors = await validate(entity)
    if (errors.length > 0) throw new ValidationError(errors)

    const { updatedCount } = await this.services.updatePassword(id, entity)

    return res.json({ updatedCount })
  }
  
  @ExceptionsWrapper()
  async deleteOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const { deletedCount } = await this.services.deleteOne(id)

    return res.json({ deletedCount })
  }

  @ExceptionsWrapper()
  async authUser(req: Request, res: Response): Promise<Response> {
    const logInData = plainToInstance(AuthUserDTO, req.body)

    const errors = await validate(logInData)
    if (errors.length > 0) throw new ValidationError(errors)

    const result = await this.services.authUser({ email: logInData.email, password: logInData.password })

    return res.json(result)
  }
}