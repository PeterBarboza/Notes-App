import { Database } from "./typeorm/database"

export class TypeORMBaseRepository {
  database: Database
  constructor(database: Database) {
    this.database = database
  }
}