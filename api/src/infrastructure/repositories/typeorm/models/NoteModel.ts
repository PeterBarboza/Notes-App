import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm"

import { Note } from "../../../../domain/entities/Note"
import { UserModel } from "./UserModel"

@Entity("note")
export class NoteModel implements Note {
  @Column({ type: "varchar", primary: true })
  id?: string

  @Column({ type: "varchar", unique: true })
  noteSlug?: string

  @Column({ type: "varchar" })
  title!: string

  @Column({ type: "text" })
  content!: string

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  @ManyToOne(
    () => UserModel,
    (userModel) => userModel.notes,
    {
      eager: true,
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  )
  author!: UserModel

  @Column({ type: "varchar", default: "private" })
  privacyStatus!: string
}