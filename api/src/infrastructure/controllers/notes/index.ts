import { Request, Response } from "express"
import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"

import { NoteServices } from "../../../domain/services/NotesServices"
import { CreateNoteDTO } from "./dto/CreateNoteDTO"
import { UpdateNoteDTO } from "./dto/UpdateNoteDTO"
import { UnauthorizedError, ValidationError } from "../../../errors"
import { ExceptionsWrapper } from "../../middlewares/errorHandler"
import { EnsureAuthenticated } from "../../middlewares/ensureAuthenticated"
import { OptionalAuthenticated } from "../../middlewares/optionalAuthenticated"
import { haveLettersVerify } from "../../shared/utils/haveLettersVerify"

export class NotesController {
  services: NoteServices

  constructor(services: NoteServices) {
    this.services = services
  }

  @ExceptionsWrapper()
  async getPublicFeed(req: Request, res: Response): Promise<Response> {
    const { pagination, filters = {} } = req.query
    const limit = pagination?.limit as number
    const skip = pagination?.skip as number

    const { results, total } = await this.services.getPublicFeed({ limit, skip, filters })

    return res.json({
      pagination: {
        total,
        limit,
        skip
      },
      results
    })
  }

  @OptionalAuthenticated()
  @ExceptionsWrapper()
  async getOne(req: Request, res: Response): Promise<Response> {
    const { noteSlug } = req.params

    if(req.userdata?.id) {
      const response = await this.services.getOneBySlug(noteSlug, req.userdata?.id)
  
      return res.json(response)
    }
    
    const response = await this.services.getOneBySlug(noteSlug)

    return res.json(response)
  }

  @EnsureAuthenticated()
  @ExceptionsWrapper()
  async create(req: Request, res: Response): Promise<Response> {
    const entity = plainToInstance(CreateNoteDTO, req.body)
    
    const errors = await validate(entity)
    if (errors.length > 0) throw new ValidationError(errors)

    const haveLetters = haveLettersVerify(entity.title)
    if (!haveLetters) 
      throw new ValidationError([
        { 
          property: "title", 
          constraints: { 
            title: "title must have at least one letter"
          }
        }
      ])

    const isAValidOperation = 
      !!req.userdata?.id && !!(req.userdata?.id === entity.author as unknown as string)

    if(!isAValidOperation) throw new UnauthorizedError({})

    const response = await this.services.create(entity)

    return res.json(response)
  }

  @EnsureAuthenticated()
  @ExceptionsWrapper()
  async updateOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const entity = plainToInstance(UpdateNoteDTO, req.body)
    
    const errors = await validate(entity)
    if (errors.length > 0) throw new ValidationError(errors)

    if(entity.title) {
      const haveLetters = haveLettersVerify(entity.title)
      if (!haveLetters) 
        throw new ValidationError([
          { 
            property: "title", 
            constraints: { 
              title: "title must have at least one letter"
            }
          }
        ])
    }

    const isAValidOperation = 
      !!req.userdata?.id && !!(req.userdata?.id === entity.author as unknown as string)

    if(!isAValidOperation) throw new UnauthorizedError({})

    const { updatedCount } = await this.services.updateOne(id, entity)

    return res.status(200).json({ updatedCount })
  }

  @EnsureAuthenticated()
  @ExceptionsWrapper()
  async deleteOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const noteToBeDeleted = await this.services.getOneById(id)

    const isAValidOperation = 
      !!req.userdata?.id && !!(req.userdata?.id === noteToBeDeleted?.author?.id as unknown as string)

    if(!isAValidOperation) throw new UnauthorizedError({})

    const { deletedCount } = await this.services.deleteOne(id)

    return res.status(200).json({ deletedCount })
  }
}