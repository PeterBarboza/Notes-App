import { Router } from "express"
import swaggerUi from "swagger-ui-express"

import { avaliableOnlyOnDevelop } from "../middlewares/avaliableOnlyOnDevelop"

import swaggerDocument from "../../swagger.json"

export const swaggerRouter = Router()

swaggerRouter.use("/", avaliableOnlyOnDevelop, swaggerUi.serve, swaggerUi.setup(swaggerDocument));