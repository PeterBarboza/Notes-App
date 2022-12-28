import { NextFunction, Request, Response } from "express"

import { apiMainLogger } from "../../app"
import { 
  NotFoundError, 
  UnauthorizedError,
  ValidationError,
  AmmountAffectedError,
  GenericError,
  UsernameAlreadyInUseError,
  EmailAlreadyInUseError,
  AppError
} from "../../errors"

export function errorHandler(
  err: AppError,
  req: Request, 
  res: Response, 
  _next: NextFunction
): Response | void {
  apiMainLogger(err)

  if (err instanceof ValidationError) {
    const errors =
      err.error.errors.map((err) => {
        return {
          [err.property]: Object.values(err.constraints || {}),
        }
      })
        
    return res.status(err.error.status).json({ errors })
  }
  if (err instanceof NotFoundError) {
    return res.status(err.error.status).json({ message: err.error.message })
  }
  if (err instanceof UnauthorizedError) {
    return res.status(err.error.status).json({ message: err.error.message })
  }
  if (err instanceof AmmountAffectedError) {
    return res.status(err.error.status).json({ message: err.error.message })
  }
  if (err instanceof GenericError) {
    return res.status(err.error.status).json({ message: err.error.message })
  }
  if (err instanceof UsernameAlreadyInUseError) {
    return res.status(err.error.status).json({ message: err.error.message })
  }
  if (err instanceof EmailAlreadyInUseError) {
    return res.status(err.error.status).json({ message: err.error.message })
  }

  return res.status(500).json({ message: "Internal server error" })
}

type exceptionsWrapperDescriptorParams = [
  req: Request, 
  res:Response, 
  next: NextFunction
]

type descriptorMethod = (...args: exceptionsWrapperDescriptorParams) => Promise<Response>

export function ExceptionsWrapper(): (...args: any) => PropertyDescriptor {
  return function (
      target: Object,
      key: string | symbol,
      descriptor: PropertyDescriptor
  ) {
      const originalMethod: descriptorMethod = descriptor.value 

      descriptor.value = async function (...[req, res, next]: exceptionsWrapperDescriptorParams) {
        try {
          return await originalMethod.apply(this, [req, res, next])
        } catch (err) {
          return next(err)
        }
      }
      return descriptor
  }
}