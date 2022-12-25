import { Request, Response, NextFunction } from "express"

export function paginationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const { pagination, filters = {} } = req.query
    const limit = pagination?.limit
    const skip = pagination?.skip

    if (pagination) {
      if (limit) {
        const parsedLimit = isNaN(Number(limit)) ? 10 : Number(limit)
        req.query.pagination!.limit = parsedLimit
      } else {
        Object.assign(req.query.pagination!, { limit: 10 })
      }

      if (skip) {
        const parsedSkip = isNaN(Number(skip)) ? 0 : Number(skip)
        req.query.pagination!.skip = parsedSkip
      } else {
        Object.assign(req.query.pagination!, { skip: 0 })
      }
    } else {
      Object.assign(req.query, {
        pagination: {
          limit: 10,
          skip: 0,
        },
        filters
      })
    }

    return next()
}