import { Request, Response, NextFunction } from "express"

import { UnauthorizedError } from "../../errors"
import { verifyAccessToken } from "../shared/utils/verifyAccessToken"

type ensureAuthenticatedDescriptorParams = [
  req: Request, 
  res: Response, 
  next: NextFunction
]

type descriptorMethod = (...args: ensureAuthenticatedDescriptorParams) => Promise<Response>

export function EnsureAuthenticated() {
  return function(
    target: Object,
    key: Object | Symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod: descriptorMethod = descriptor.value

    descriptor.value = async function (...[req, res, next]: ensureAuthenticatedDescriptorParams) {
      try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
          throw new UnauthorizedError({ substituteMessage: "No token provided" })
        }

        const parts = authHeader.split(" ")

        if (parts.length !== 2) {
          throw new UnauthorizedError({ substituteMessage: "Invalid token" })
        }

        const [scheme, token] = parts

        if (!/^Bearer$/i.test(scheme)) {
          throw new UnauthorizedError({ substituteMessage: "Invalid token" })
        }

        const tokenData = verifyAccessToken(token)
        
        if (!tokenData || !tokenData?.sub || !tokenData?.username) {
          throw new UnauthorizedError({ substituteMessage: "Invalid token" })
        }
        
        req.userdata = { id: tokenData.sub, username: tokenData.username }

        return await originalMethod.apply(this, [req, res, next])
      } catch (err) {
        return next(err)
      }
    }
  }
}