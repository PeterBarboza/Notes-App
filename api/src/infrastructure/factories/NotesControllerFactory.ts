import { Database } from "../repositories/typeorm/database"
import { NotesRepository } from "../repositories/NotesRepository"
import { NoteServices } from "../../domain/services/NotesServices"
import { NotesController } from "../controllers/notes"

export class NotesControllerFactory {
  handle() {
    const database = new Database()
    const repository = new NotesRepository(database)
    const service = new NoteServices(repository)

    return new NotesController(service)
  }
}
