import {
  AppError,
  GenericError,
  ValidationError,
  NotFoundError,
  AmmountAffectedError,
  UnauthorizedError,
  ExpiredTokenError
} from "../../../errors"

export function isError(object: AppError | unknown): boolean {
  const result = 
    (object instanceof GenericError) ||
    (object instanceof ValidationError) ||
    (object instanceof NotFoundError) ||
    (object instanceof AmmountAffectedError) ||
    (object instanceof UnauthorizedError) ||
    (object instanceof ExpiredTokenError)

  return result
}