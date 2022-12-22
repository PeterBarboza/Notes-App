import { Database } from "./typeorm/database"

export type TypeORMBaseRepositoryConstructor = {
  database: Database
}

export class TypeORMBaseRepository {
  database: Database
  constructor({ database }: TypeORMBaseRepositoryConstructor) {
    this.database = database
  }
}