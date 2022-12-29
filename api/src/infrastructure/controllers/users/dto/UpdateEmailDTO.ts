import { IsString, IsNotEmpty, IsEmail } from "class-validator"

import { User } from "../../../../domain/entities/User"

export class UpdateEmailDTO extends User {
  @IsNotEmpty()
  @IsString()
  password!: string

  @IsNotEmpty()
  @IsEmail()
  email!: string
}