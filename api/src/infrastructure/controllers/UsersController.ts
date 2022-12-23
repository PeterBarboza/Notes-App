import { Request, Response } from "express"

import { User } from "domain/entities/User"
import { UserServices } from "domain/services/UsersServices"

export class UsersController {
  services: UserServices

  constructor(services: UserServices) {
    this.services = services
  }

  async getMany(req: Request, res: Response): Promise<Response> {
    const response = await this.services.getMany()

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