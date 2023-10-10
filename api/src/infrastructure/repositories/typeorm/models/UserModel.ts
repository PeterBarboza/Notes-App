import { Column, CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm"

import { User } from "../../../../domain/entities/User"
import { NoteModel } from "./NoteModel"


@Entity("user")
export class UserModel implements User {
  @Column({ type: "varchar", primary: true })
  id?: string

  @Column({ type: "varchar", unique: true })
  username!: string

  @Column({ type: "varchar", unique: true, select: false })
  email!: string

  @Column({ type: "varchar", select: false })
  password!: string

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  @OneToMany(
    () => NoteModel,
    (noteModel) => noteModel.author,
    {
      lazy: false,
      nullable: true,
      cascade: true,
      onUpdate: 'CASCADE'
    }
  )
  notes?: NoteModel[]
}