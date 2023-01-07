import { IsString, IsNotEmpty } from "class-validator"

import { User } from "../../../../domain/entities/User"

export class AuthUserWithEmailAndPasswordDTO extends User {
  @IsNotEmpty()
  @IsString()
  email!: string

  @IsNotEmpty()
  @IsString()
  password!: string
}