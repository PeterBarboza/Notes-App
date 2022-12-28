import { Database } from "../repositories/typeorm/database"
import { UsersRepository } from "../repositories/UsersRepository"
import { UserServices } from "../../domain/services/UsersServices"
import { UsersController } from "../controllers/users"

export class UsersControllerFactory {
  handle() {
    const database = new Database()
    const repository = new UsersRepository(database)
    const service = new UserServices(repository)

    return new UsersController(service)
  }
}
