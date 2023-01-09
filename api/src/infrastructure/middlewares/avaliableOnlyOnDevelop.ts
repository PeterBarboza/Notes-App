import { Request, Response, NextFunction } from "express"

import { CONFIG } from "../../configs"

export function avaliableOnlyOnDevelop(req: Request, res: Response, next: NextFunction): Response | void{
  if(CONFIG.environment === "develop") {
    return next()
  }

  const path = req?.originalUrl || ""

  const response = {
    message: `The path ${path} was not found in this server.`
  }

  return res.status(404).json(response)
}