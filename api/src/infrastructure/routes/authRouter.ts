import { Router } from "express"

import { AuthUserControllerFactory } from "../factories/AuthUserControllerFactory"

export const authRouter = Router()

const authController = new AuthUserControllerFactory().handle()

authRouter.post("/", authController.authUserWithEmailAndPassword.bind(authController))
authRouter.post("/rt", authController.authUserWithRefreshtoken.bind(authController))