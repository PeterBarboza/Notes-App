import { ValidationError as ClassValidatorError } from "class-validator"

type errorReturn = {
  status: number
  message: string
}
type validationErrorReturn = {
  status: number
  errors: ClassValidatorError[]
}
type genericErrorReturn = {
  status: number
  message: string
}
type ammountAffectedErrorReturn = {
  status: number
  message: string
}


export type notFoundErrorConstructor = {
  entityName: string
  substituteMessage?: string
}
export type genericErrorConstructor = {
  message: string
}
type ammountAffectedErrorConstructor = {
  entityName: string
  shouldBeAffect: number
  wasAffected: number
  substituteMessage?: string
}
export type unauthorizedErrorConstructor = {
  entityName: string
  substituteMessage?: string
}

export type AppError = NotFoundError | UnauthorizedError | Error

export class NotFoundError {
  error: errorReturn

  constructor({
    entityName,
    substituteMessage
  }: notFoundErrorConstructor) {
    this.error = {
      status: 404,
      message: substituteMessage ? substituteMessage : `${entityName} not found`
    }
  }
}

export class ValidationError {
  error: validationErrorReturn

  constructor(errors: ClassValidatorError[]) {
    this.error = {
      errors: errors,
      status: 400
    }
  }
}

export class GenericError {
  error: genericErrorReturn

  constructor({ message }: genericErrorConstructor) {
    this.error = {
      status: 400,
      message: message
    }
  }
}

export class AmmountAffectedError {
  error: genericErrorReturn

  constructor({ 
    shouldBeAffect, 
    wasAffected, 
    entityName, 
    substituteMessage
   }: ammountAffectedErrorConstructor) {
    const message = `${shouldBeAffect} ${entityName}(s) should be affected but ${wasAffected} was affected`

    this.error = {
      status: 400,
      message: substituteMessage ? substituteMessage : message
    }
  }
}

export class UnauthorizedError {
  error: errorReturn

  constructor({ substituteMessage }: unauthorizedErrorConstructor) {
    this.error = {
      status: 401,
      message: substituteMessage ? substituteMessage : `Unauthorized action`
    }
  }
}