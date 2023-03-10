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
import { EnsureAuthenticated } from "../../middlewares/ensureAuthenticated"
import { OptionalAuthenticated } from "../../middlewares/optionalAuthenticated"
import { DeleteUserDTO } from "./dto/DeleteUserDTO"

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
  async getOneByUsername(req: Request, res: Response): Promise<Response> {
    const { username } = req.params

    const response = await this.services.getOneByUsername(username)

    return res.json(response)
  }

  @ExceptionsWrapper()
  async getOneById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const response = await this.services.getOneById(id)

    return res.json(response)
  }

  @OptionalAuthenticated()
  @ExceptionsWrapper()
  async getOneWithNotes(req: Request, res: Response): Promise<Response> {
    const { username } = req.params

    if(req.userdata?.username && (req.userdata.username === username)) {
      const response = await this.services.getOneByUsernameWithNotes(username, ["private", "public"])
  
      return res.json(response)
    }

    const response = await this.services.getOneByUsernameWithNotes(username, ["public"])

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

  @EnsureAuthenticated()
  @ExceptionsWrapper()
  async updateOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const entity = plainToInstance(UpdateUserDTO, req.body)

    const errors = await validate(entity)
    if (errors.length > 0) throw new ValidationError(errors)

    const isAValidOperation = req.userdata?.id && (req.userdata?.id === id)
    if(!isAValidOperation) throw new UnauthorizedError({})

    const { updatedCount } = await this.services.updateOne(id, entity)

    return res.json({ updatedCount })
  }

  @EnsureAuthenticated()
  @ExceptionsWrapper()
  async updateEmail(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const entity = plainToInstance(UpdateEmailDTO, req.body)
    
    const errors = await validate(entity)
    if (errors.length > 0) throw new ValidationError(errors)

    const isAValidOperation = req.userdata?.id && (req.userdata?.id === id)
    if(!isAValidOperation) throw new UnauthorizedError({})

    const { updatedCount } = await this.services.updateEmail(id, entity)

    return res.json({ updatedCount })
  }
  
  @EnsureAuthenticated()
  @ExceptionsWrapper()
  async updatePassword(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const entity = plainToInstance(UpdatePasswordDTO, req.body)

    const errors = await validate(entity)
    if (errors.length > 0) throw new ValidationError(errors)

    const isAValidOperation = req.userdata?.id && (req.userdata?.id === id)
    if(!isAValidOperation) throw new UnauthorizedError({})

    const { updatedCount } = await this.services.updatePassword(id, entity)

    return res.json({ updatedCount })
  }
  
  @EnsureAuthenticated()
  @ExceptionsWrapper()
  async deleteOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const entity = plainToInstance(DeleteUserDTO, req.body)
    
    const errors = await validate(entity)
    if (errors.length > 0) throw new ValidationError(errors)

    const isAValidOperation = req.userdata?.id && (req.userdata?.id === id)
    if(!isAValidOperation) throw new UnauthorizedError({})

    const { deletedCount } = await this.services.deleteOne(id, { password: entity.password })

    return res.json({ deletedCount })
  }
}