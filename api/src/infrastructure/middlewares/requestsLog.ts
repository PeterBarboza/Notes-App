import { NextFunction, Request, Response } from "express"

import { apiMainLogger } from "../../app"

export function requestsLog(req: Request, res: Response, next: NextFunction): void {
  const {
    method,
    protocol,
    hostname,
    originalUrl,
  } = req

  apiMainLogger(`method [${method}] requested on path: ${protocol}://${hostname}${originalUrl}`)

  next()
}