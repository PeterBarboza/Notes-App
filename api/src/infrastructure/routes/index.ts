import { Router } from "express"

import { notesRouter } from "./notesRouter"
import { usersRouter } from "./usersRouter"
import { authRouter } from "./authRouter"
import { swaggerRouter } from "./swaggerRouter"
// import { emailRouter } from "./emailsRouter"

export const router = Router()

router.use("/notes", notesRouter)
router.use("/users", usersRouter)
router.use("/auth", authRouter)
router.use("/docs", swaggerRouter)
// router.use("/email", emailRouter)