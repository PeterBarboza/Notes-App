import { ValidationError as ClassValidatorError } from "class-validator"

type validationErrorReturn = {
  status: number
  errors: ClassValidatorError[]
}
type genericErrorReturn = {
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
  substituteMessage?: string
}
export type emailAlreadyInUseErrorConstructor = {
  substituteMessage?: string
}
export type usernameAlreadyInUseErrorConstructor = {
  substituteMessage?: string
}

export type AppError = 
  NotFoundError |
  ValidationError |
  GenericError |
  AmmountAffectedError |
  UnauthorizedError |
  Error

export class NotFoundError {
  error: genericErrorReturn

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
  error: genericErrorReturn

  constructor({ substituteMessage }: unauthorizedErrorConstructor) {
    this.error = {
      status: 401,
      message: substituteMessage ? substituteMessage : `Unauthorized action`
    }
  }
}