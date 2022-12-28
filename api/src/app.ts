import express from "express"
import logger from "debug"

import { router } from "./infrastructure/routes"
import { requestsLogger } from "./infrastructure/middlewares/requestsLogger"
import { errorHandler } from "./infrastructure/middlewares/errorHandler"
import { routeNotFound } from "./infrastructure/middlewares/routeNotFound"

const apiMainLogger = logger("api:main")

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(requestsLogger)

app.use(router)

app.use(routeNotFound)
app.use(errorHandler)

export { app, apiMainLogger }