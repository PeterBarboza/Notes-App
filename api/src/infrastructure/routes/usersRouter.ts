import { Router } from "express"

import { UsersControllerFactory } from "../factories/UsersControllerFactory"
import { paginationMiddleware } from "../middlewares/pagination"

export const usersRouter = Router()

const notesController = new UsersControllerFactory().handle()

usersRouter.get(
  "/",
  paginationMiddleware,
  notesController.getMany.bind(notesController)
)
usersRouter.get(
  "/:username",
  notesController.getOne.bind(notesController)
)
usersRouter.post(
  "/",
  notesController.create.bind(notesController)
)
usersRouter.patch(
  "/:id",
  notesController.updateOne.bind(notesController)
)
usersRouter.delete(
  "/:id",
  notesController.deleteOne.bind(notesController)
)
