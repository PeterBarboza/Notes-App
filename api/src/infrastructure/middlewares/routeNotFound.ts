import { Request, Response } from "express"

export function routeNotFound(req: Request, res: Response): Response {
  const { originalUrl } = req

  const response = {
    message: `The path ${originalUrl} was not found in this server.`
  }

  return res.status(404).json(response)
}