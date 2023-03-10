import { NextFunction, Request, Response } from "express"

import { AppError } from "../../errors"
import { isError } from "../shared/utils/isError"

export function routeNotFound(req: Request, res: Response, next: NextFunction): Response | void {
  const path = req?.originalUrl
  const method = req.method

  //If true, it's an error catched from @ExceptionsWrapper() decorator
  if(isError(req)) return next(req)

  const response = {
    message: `The path [${method}] ${path} was not found in this server.`
  }

  return res.status(404).json(response)
}