import { NextFunction, Request, Response } from "express"
import { format } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"

import { apiMainLogger } from "../../app"

export function requestsLogger(req: Request, res: Response, next: NextFunction): void {
  const {
    method,
    protocol,
    hostname,
    originalUrl,
  } = req

  const startedAt = Date.now()

  res.on("finish", () => {
    const finishedAt = Date.now()
    const duration = finishedAt - startedAt
    const statusCode = res.statusCode

    const formatedStartedAt = format(startedAt, "dd/MM/yyyy - HH:mm", {
		  locale: ptBR
	  })

    apiMainLogger(`Method [${method}] - Status [${statusCode}] - Requested path [${protocol}://${hostname}${originalUrl}] - At [${formatedStartedAt}] - Duration ${duration}ms`)
  })
  res.on("error", () => {
    const finishedAt = Date.now()
    const duration = finishedAt - startedAt
    const statusCode = res.statusCode

    apiMainLogger(`ERROR | Method [${method}] - Status [${statusCode}] - Requested path: ${protocol}://${hostname}${originalUrl} - Duration ${duration}ms`)
  })

  next()
}