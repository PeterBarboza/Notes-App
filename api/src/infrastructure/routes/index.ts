import { Router } from "express"

import { notesRouter } from "./notesRouter"
import { usersRouter } from "./usersRouter"
import { authRouter } from "./authRouter"

export const router = Router()

router.use("/notes", notesRouter)
router.use("/users", usersRouter)
router.use("/auth", authRouter)