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
  "/username/:username",
  notesController.getOneByUsername.bind(notesController)
)
usersRouter.get(
  "/id/:id",
  notesController.getOneById.bind(notesController)
)
usersRouter.get(
  "/username/:username/notes",
  notesController.getOneWithNotes.bind(notesController)
)
usersRouter.post(
  "/",
  notesController.create.bind(notesController)
)
usersRouter.patch(
  "/:id",
  notesController.updateOne.bind(notesController)
)
usersRouter.patch(
  "/:id/email",
  notesController.updateEmail.bind(notesController)
)
usersRouter.patch(
  "/:id/password",
  notesController.updatePassword.bind(notesController)
)
usersRouter.delete(
  "/:id",
  notesController.deleteOne.bind(notesController)
)
