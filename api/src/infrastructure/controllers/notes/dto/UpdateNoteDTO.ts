import { IsString, IsOptional,  } from "class-validator"

import { Note } from "../../../../domain/entities/Note"

export class UpdateNoteDTO extends Note {
  @IsOptional()
  @IsString()
  title!: string

  @IsOptional()
  @IsString()
  content!: string

  @IsOptional()
  @IsString()
  privacyStatus!: string
}