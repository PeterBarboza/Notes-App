import { IsString, IsNotEmpty } from "class-validator"

import { User } from "../../../../domain/entities/User"

export class UpdatePasswordDTO extends User {
  @IsNotEmpty()
  @IsString()
  newPassword!: string

  @IsNotEmpty()
  @IsString()
  oldPassword!: string
}