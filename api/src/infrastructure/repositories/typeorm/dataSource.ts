import { DataSource } from "typeorm"
import 'reflect-metadata'

import { CONFIG } from "../../../configs"

export const AppDataSource = new DataSource(CONFIG.typeorm.dataSourceOptions)