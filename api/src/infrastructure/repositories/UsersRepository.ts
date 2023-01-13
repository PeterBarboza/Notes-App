import { pick } from "lodash"

import { TypeORMBaseRepository } from "./typeorm"
import { UserModel } from "./typeorm/models/UserModel"

import { 
  deleteOneResponse,
  getManyOptions,
  getManyOptionsFilter,
  getManyResponse,
  IUsersRepository,
  updateOneResponse
} from "../shared/interface"

export class UsersRepository extends TypeORMBaseRepository implements IUsersRepository<UserModel> {
  async getMany({ filters, limit, skip }: getManyOptions): Promise<getManyResponse<UserModel>> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(UserModel)

    const selectedFilters: getManyOptionsFilter = pick(filters, [
      "id",
      "username",
      "email",
      "createdAt",
      "updatedAt",
    ])

    const [results, total] = await repository.findAndCount({
      where: {
        ...selectedFilters
      },
      skip: skip,
      take: limit,
      order: {
        updatedAt: -1,
      },
    })

    return {
      total: total,
      results: results
    }
  }

  async getOneByUsername(username: string): Promise<UserModel> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(UserModel)

    const result = await repository.findOne({
      where: {
        username: username
      }
    })

    return result!
  }

  async getOneByUsernameWithNotes(username: string, privacyStatus: string[]): Promise<UserModel> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(UserModel)

    const result = await repository
    .createQueryBuilder("user")
    .leftJoinAndSelect(
      "user.notes",
      "note",
      "note.privacyStatus IN (:...privacyStatus)",
      { privacyStatus: privacyStatus }
    )
    .where("user.username = :username", { username: username })
    .getOne()

    return result!
  }

  async getOneByEmail(email: string): Promise<UserModel> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(UserModel)

    const result = await repository.findOne({
      where: {
        email: email
      }
    })

    return result!
  }

  async getOneById(id: string): Promise<UserModel> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(UserModel)

    const result = await repository.findOne({
      where: {
        id: id
      }
    })

    return result!
  }

  async getOneByIdWithEmailAndPassword(id: string): Promise<UserModel> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(UserModel)

    const result = await repository
      .createQueryBuilder("user")
      .select("user.id", "id")
      .addSelect("user.id")
      .addSelect("user.email")
      .addSelect("user.username")
      .addSelect("user.password")
      .addSelect("user.createdAt")
      .addSelect("user.updatedAt")
      .where("id = :id", { id: id })
      .getOne()

    return result!
  }

  async getOneByEmailWithEmailAndPassword(email: string): Promise<UserModel> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(UserModel)

    const result = await repository
      .createQueryBuilder("user")
      .select("user.email", "email")
      .addSelect("user.id")
      .addSelect("user.email")
      .addSelect("user.username")
      .addSelect("user.password")
      .addSelect("user.createdAt")
      .addSelect("user.updatedAt")
      .where("email = :email", { email: email })
      .getOne()

    return result!
  }

  async create(data: UserModel): Promise<UserModel> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(UserModel)

    const entity = repository.create(data)
    const result = await repository.save(entity)

    return {
      ...result,
      password: undefined
    } as any
  }

  async updateOne(id: string, entity: Partial<UserModel>): Promise<updateOneResponse> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(UserModel)

    const { affected = 0 } = await repository.update(id, entity)

    return {
      updatedCount: affected
    }
  }

  async deleteOne(id: string): Promise<deleteOneResponse> {
    const database = await this.database.getDatabase()
    const repository = database.getRepository(UserModel)

    const { affected } = await repository.delete(id)

    return {
      deletedCount: affected || 0
    }
  }
}