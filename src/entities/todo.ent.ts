import { Entity, Column } from "typeorm";

import Base from "./base.ent";

@Entity()
class Todo extends Base {
  @Column()
  name: string;

  @Column("text")
  content: string;
}

export default Todo;
