import { IsString, IsNotEmpty } from "class-validator"

export class DeleteUserDTO {
  @IsNotEmpty()
  @IsString()
  password!: string
}