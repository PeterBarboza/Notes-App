import express from "express"
import logger from "debug"
import cors from "cors"

import { router } from "./infrastructure/routes"
import { requestsLogger } from "./infrastructure/middlewares/requestsLogger"
import { errorHandler } from "./infrastructure/middlewares/errorHandler"
import { routeNotFound } from "./infrastructure/middlewares/routeNotFound"

const apiMainLogger = logger("api:main")

const app = express()

//TODO: Configurar o cors corretamente antes do deploy
app.use(cors())
app.use(requestsLogger)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/api/v1", router)

app.use(routeNotFound)
app.use(errorHandler)

export { app, apiMainLogger }