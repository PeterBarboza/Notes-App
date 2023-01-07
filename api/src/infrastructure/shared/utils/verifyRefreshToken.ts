import { TokenExpiredError, verify } from "jsonwebtoken"

import { CONFIG } from "../../../configs"
import { ExpiredTokenError } from "../../../errors"

import { ITokenPayload } from "../interface"

export function verifyRefreshToken(token: string): ITokenPayload | undefined {
  try {
    const result = verify(token, CONFIG.refreshTokenSecret) as ITokenPayload
  
    return result || undefined
  } catch (err) {
    if(err instanceof TokenExpiredError) {
      throw new ExpiredTokenError({ requestNewToken: false }) 
    }
    throw err
  }
}