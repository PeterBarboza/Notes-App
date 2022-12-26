import { IsString, IsNotEmpty, IsUUID } from "class-validator"

import { Note } from "../../../../domain/entities/Note"
import { User } from "../../../../domain/entities/User"

export class CreateNoteDTO extends Note {
  @IsNotEmpty()
  @IsString()
  title!: string

  @IsNotEmpty()
  @IsString()
  content!: string

  @IsNotEmpty()
  @IsString()
  @IsUUID("4")
  author!: User

  @IsNotEmpty()
  @IsString()
  privacyStatus!: string
}