import { DataSource } from "typeorm"

import { AppDataSource } from "./dataSource"
import { apiMainLogger } from "../../../app"

export class Database {
  async getDatabase(): Promise<DataSource> {
    try {
      if(!AppDataSource.isInitialized) {
        const dataSource = await AppDataSource.initialize()

        apiMainLogger("Connected to the database")

        return dataSource
      }
    } catch (error) {
      apiMainLogger("Connection to database failed")
      apiMainLogger(error)
    }

    return AppDataSource
  }
}
