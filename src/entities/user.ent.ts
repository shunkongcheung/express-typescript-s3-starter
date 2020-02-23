import { Column, Entity } from "typeorm";
import Base from "./base.ent";

@Entity()
class User extends Base {
  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: "" })
  firstName: string;

  @Column({ default: "" })
  lastName: string;
}

export default User;
