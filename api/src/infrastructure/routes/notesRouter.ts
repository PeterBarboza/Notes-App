import { Router } from "express"

import { NotesControllerFactory } from "../factories/NotesControllerFactory"
import { paginationMiddleware } from "../middlewares/pagination"

export const notesRouter = Router()

const notesController = new NotesControllerFactory().handle()

notesRouter.get(
  "/",
  paginationMiddleware,
  notesController.getPublicFeed.bind(notesController)
)
notesRouter.get(
  "/:noteSlug",
  notesController.getOne.bind(notesController)
)
notesRouter.post(
  "/",
  notesController.create.bind(notesController)
)
notesRouter.patch(
  "/:id",
  notesController.updateOne.bind(notesController)
)
notesRouter.delete(
  "/:id",
  notesController.deleteOne.bind(notesController)
)
