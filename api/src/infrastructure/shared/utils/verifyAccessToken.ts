import { TokenExpiredError, verify } from "jsonwebtoken"

import { CONFIG } from "../../../configs"
import { ExpiredTokenError } from "../../../errors"

import { ITokenPayload } from "../interface"

export function verifyAccessToken(token: string): ITokenPayload | undefined {
  try {
    const result = verify(token, CONFIG.accessTokenSecret) as ITokenPayload
  
    return result || undefined
  } catch (err) {
    if(err instanceof TokenExpiredError) {
      throw new ExpiredTokenError({ requestNewToken: true })    
    }
    throw err
  }
}