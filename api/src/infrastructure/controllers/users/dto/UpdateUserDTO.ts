import { IsString, IsOptional } from "class-validator"

import { User } from "../../../../domain/entities/User"

export class UpdateUserDTO extends User {
  @IsOptional()
  @IsString()
  username!: string

  @IsOptional()
  @IsString()
  email!: string

  @IsOptional()
  @IsString()
  newPassword?: string

  @IsOptional()
  @IsString()
  oldPassword?: string
}