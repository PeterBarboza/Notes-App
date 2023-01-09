import { DataSourceOptions } from "typeorm"
import "dotenv/config"

import { TYPE_ORM_MODELS } from "../infrastructure/repositories/typeorm/models"

const migrationsRelativePath = "infrastructure/repositories/typeorm/migrations/*.{ts,js}"

export const CONFIG = {
  port: process.env.PORT || 3333,
  serverHost: process.env.SERVER_HOST!,
  environment: process.env.NODE_ENV || "develop",
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  typeorm: {
    dataSourceOptions: {
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      migrations: [migrationsRelativePath, `src/${migrationsRelativePath}`],
      entities: TYPE_ORM_MODELS
    } as DataSourceOptions
  }
}
