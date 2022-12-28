import { Router } from "express"

import { notesRouter } from "./notesRouter"
import { usersRouter } from "./usersRouter"

export const router = Router()

router.use("/notes", notesRouter)
router.use("/users", usersRouter)