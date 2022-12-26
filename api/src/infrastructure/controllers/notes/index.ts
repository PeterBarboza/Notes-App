import { Request, Response } from "express"
import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"

import { NoteServices } from "../../../domain/services/NotesServices"
import { CreateNoteDTO } from "./dto/CreateNoteDTO"
import { UpdateNoteDTO } from "./dto/UpdateNoteDTO"
import { ValidationError } from "../../../errors"
import { ExceptionsWrapper } from "../../middlewares/errorHandler"

export class NotesController {
  services: NoteServices

  constructor(services: NoteServices) {
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
    const { id } = req.params

    const response = await this.services.getOne(id)

    return res.json(response)
  }

  @ExceptionsWrapper()
  async create(req: Request, res: Response): Promise<Response> {
    const entity = plainToInstance(CreateNoteDTO, req.body)
    
    const errors = await validate(entity)
    if (errors.length > 0) throw new ValidationError(errors)

    const response = await this.services.create(entity)

    return res.json(response)
  }

  @ExceptionsWrapper()
  async updateOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const entity = plainToInstance(UpdateNoteDTO, req.body)
    
    const errors = await validate(entity)
    if (errors.length > 0) throw new ValidationError(errors)

    await this.services.updateOne(id, entity)

    return res.sendStatus(200)
  }

  @ExceptionsWrapper()
  async deleteOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    await this.services.deleteOne(id)

    return res.sendStatus(200)
  }
}