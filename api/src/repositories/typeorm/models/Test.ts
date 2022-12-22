import { Column, Entity } from "typeorm"

@Entity("test")
export class Test {
  @Column({ type: "varchar", primary: true })
  id?: string

  @Column({ type: "varchar", nullable: true })
  name?: string
}