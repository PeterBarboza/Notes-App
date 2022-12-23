import express from "express"
import log from "debug"

import { requestsLog } from "./infrastructure/middlewares/requestsLog"

const apiMainLogger = log("api:main")

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(requestsLog)

export { app, apiMainLogger }