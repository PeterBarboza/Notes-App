import { NextFunction, Request, Response } from "express";

import { apiMainLogger } from "../../app"
import { 
  NotFoundError, 
  UnauthorizedError,
  ValidationError,
  AmmountAffectedError,
  AppError
} from "../../errors"

export function errorHandler(
  err: AppError,
  req: Request, 
  res: Response, 
  _next: NextFunction
): Response {
  apiMainLogger(JSON.stringify(err, null, 2))

  if (err instanceof NotFoundError) {
    return res.status(err.error.status).json(err.error.message)
  }
  if (err instanceof UnauthorizedError) {
    return res.status(err.error.status).json(err.error.message)
  }
  if (err instanceof ValidationError) {
    return res.status(err.error.status).json(err.error.errors)
  }
  if (err instanceof AmmountAffectedError) {
    return res.status(err.error.status).json(err.error.message)
  }

  return res.status(500).json({ message: "Internal server error" })
}

type exceptionsWrapperDescriptorParams = [
  req: Request, 
  res:Response, 
  next: NextFunction
]

export function ExceptionsWrapper(): (...args: any) => PropertyDescriptor {
  return function (
      target: Object,
      key: string | symbol,
      descriptor: PropertyDescriptor
  ) {
      const originalMethod = descriptor.value

      descriptor.value = function ([req, res, next]: exceptionsWrapperDescriptorParams) {
        try {
          const result = originalMethod.apply(this, [req, res, next])
          if (result && result instanceof Promise) {
            return result
              .then((result) => result)
              .catch((error) => next(error))
          }
          return result
        } catch (err) {
          return next(err)
        }
      }
      return descriptor
  }
}