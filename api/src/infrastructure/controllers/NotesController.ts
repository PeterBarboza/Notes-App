import { Request, Response } from "express"

import { NoteServices } from "../../domain/services/NotesServices"

export class NotesController {
  services: NoteServices

  constructor(services: NoteServices) {
    this.services = services
  }

  //TODO: Consertar a tipagem dessas variáveis
  async getMany(req: Request, res: Response): Promise<Response> {
    const { limit, skip } = req.query.pagination as any
    const filters = req.query.filters as any

    const response = await this.services.getMany({ limit, skip, filters })

    return res.json(response)
  }

  async getOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const response = await this.services.getOne(id)

    return res.json(response)
  }

  async create(req: Request, res: Response): Promise<Response> {
    const entity = req.body

    const response = await this.services.create(entity)

    return res.json(response)
  }

  async updateOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const entity = req.body

    await this.services.updateOne(id, entity)

    return res.sendStatus(200)
  }

  async deleteOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    await this.services.deleteOne(id)

    return res.sendStatus(200)
  }
}