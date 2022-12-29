import { IsString, IsOptional, IsNotEmpty } from "class-validator"

import { User } from "../../../../domain/entities/User"

export class UpdateUserDTO extends User {
  @IsNotEmpty()
  @IsString()
  username!: string
}