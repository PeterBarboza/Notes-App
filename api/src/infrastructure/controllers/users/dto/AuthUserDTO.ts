import { IsNotEmpty, IsString } from "class-validator";
import { User } from "../../../../domain/entities/User";

export class AuthUserDTO extends User {
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string
}