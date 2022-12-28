import { NextFunction, Request, Response } from "express"

import { AppError } from "../../errors"

export function routeNotFound(req: Request, res: Response, next: NextFunction): Response | void {
  const path = req?.originalUrl

  //If has no path, the req object is an error from @ExceptionsWrapper() decorator
  if(!path) return next(req)

  const response = {
    message: `The path ${path} was not found in this server.`
  }

  return res.status(404).json(response)
}