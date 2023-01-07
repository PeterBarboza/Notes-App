import { compareSync } from "bcryptjs"
import { sign } from "jsonwebtoken"

import { CONFIG } from "../../configs"
import { User } from "../entities/User"
import { UnauthorizedError } from "../../errors"
import { verifyRefreshToken } from "../../infrastructure/shared/utils/verifyRefreshToken"

import { IUsersRepository } from "../../infrastructure/shared/interface"

type authUserWithEmailAndPasswordParams = {
  email: string
  password: string
}

export class AuthUserServices {
  private repository: IUsersRepository<User>

  constructor(repository: IUsersRepository<User>) {
    this.repository = repository
  }

  async authUserWithEmailAndPassword({ email, password }: authUserWithEmailAndPasswordParams) {
    const user = await this.repository.getOneByEmailWithPassword(email)
    if(!user) throw new UnauthorizedError({ substituteMessage: "Email or password incorrect" })

    const passwordMatch = compareSync(password, user.password)
    if(!passwordMatch) throw new UnauthorizedError({ substituteMessage: "Email or password incorrect" })

    const refreshToken = sign({}, CONFIG.refreshTokenSecret, {
      subject: user.id,
      expiresIn: "30d"
    })
    const accessToken = sign({}, CONFIG.accessTokenSecret, {
      subject: user.id,
      expiresIn: "1h"
    })

    return { accessToken, refreshToken }
  }

  async authUserWithRefreshtoken(refreshToken: string) {
    const tokenData = verifyRefreshToken(refreshToken)
    
    if (!tokenData || !tokenData?.sub) {
      throw new UnauthorizedError({ substituteMessage: "Invalid token" })
    }

    const user = await this.repository.getOneById(tokenData.sub)

    if(!user) throw new UnauthorizedError({ substituteMessage: "Invalid token" })

    const newRefreshToken = sign({}, CONFIG.refreshTokenSecret, {
      subject: user.id,
      expiresIn: "30d"
    })
    const accessToken = sign({}, CONFIG.accessTokenSecret, {
      subject: user.id,
      expiresIn: "1h"
    })

    return { accessToken, refreshToken: newRefreshToken }
  }
}