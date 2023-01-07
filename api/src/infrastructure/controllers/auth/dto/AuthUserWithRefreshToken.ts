import { IsString, IsNotEmpty } from "class-validator"

export class AuthUserWithRefreshToken {
  @IsNotEmpty()
  @IsString()
  refreshToken!: string
}