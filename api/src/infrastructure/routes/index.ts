import { Router } from "express"

import { notesRouter } from "./notesRouter"

export const router = Router()

router.use("/notes", notesRouter)