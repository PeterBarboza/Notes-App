import { IsString, IsNotEmpty, IsEmail } from "class-validator"

import { User } from "../../../../domain/entities/User"

export class CreateUserDTO extends User {
  @IsNotEmpty()
  @IsString()
  username!: string

  @IsNotEmpty()
  @IsEmail()
  email!: string

  @IsNotEmpty()
  @IsString()
  password!: string
}