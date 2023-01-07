import { Request, Response } from "express"
import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"

import { AuthUserServices } from "../../../domain/services/AuthUserServices"
import { ValidationError } from "../../../errors"
import { AuthUserWithEmailAndPasswordDTO } from "./dto/AuthUserWithEmailAndPasswordDTO"
import { AuthUserWithRefreshToken } from "./dto/AuthUserWithRefreshToken"
import { ExceptionsWrapper } from "../../middlewares/errorHandler"

export class AuthController {
  services: AuthUserServices

  constructor(services: AuthUserServices) {
    this.services = services
  }

  @ExceptionsWrapper()
  async authUserWithEmailAndPassword(req: Request, res: Response): Promise<Response> {
    const creds = plainToInstance(AuthUserWithEmailAndPasswordDTO, req.body)
    
    const errors = await validate(creds)
    if (errors.length > 0) throw new ValidationError(errors)

    const result = await this.services.authUserWithEmailAndPassword({
      email: creds.email,
      password: creds.password
    })

    return res.json(result)
  }

  @ExceptionsWrapper()
  async authUserWithRefreshtoken(req: Request, res: Response): Promise<Response> {
    const creds = plainToInstance(AuthUserWithRefreshToken, req.body)
    
    const errors = await validate(creds)
    if (errors.length > 0) throw new ValidationError(errors)

    const result = await this.services.authUserWithRefreshtoken(creds.refreshToken)

    return res.json(result)
  }
}