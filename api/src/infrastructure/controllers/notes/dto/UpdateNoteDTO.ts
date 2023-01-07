import { IsString, IsOptional, IsNotEmpty, IsUUID,  } from "class-validator"

import { Note } from "../../../../domain/entities/Note"
import { User } from "../../../../domain/entities/User"

export class UpdateNoteDTO extends Note {
  @IsOptional()
  @IsString()
  title!: string

  @IsOptional()
  @IsString()
  content!: string

  @IsNotEmpty()
  @IsString()
  @IsUUID("4")
  author!: User

  @IsOptional()
  @IsString()
  privacyStatus!: string
}