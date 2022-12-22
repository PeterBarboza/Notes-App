import { AppDataSource } from "./dataSource"
import { apiMainLogger } from "../../app"

export class Database {
  async getDatabase() {
    try {
      if(!AppDataSource.isInitialized) {
        const dataSource = await AppDataSource.initialize()

        apiMainLogger("Connected to the database")

        return dataSource
      }
    } catch (error) {
      apiMainLogger("Connection to database failed")
      apiMainLogger(JSON.stringify(error, null, 2))
    }

    return AppDataSource
  }
}
