import { Database } from "../repositories/typeorm/database"
import { UsersRepository } from "../repositories/UsersRepository"
import { AuthUserServices } from "../../domain/services/AuthUserServices"
import { AuthController } from "../controllers/auth"

export class AuthUserControllerFactory {
  handle() {
    const database = new Database()
    const repository = new UsersRepository(database)
    const services = new AuthUserServices(repository)

    return new AuthController(services)
  }
}