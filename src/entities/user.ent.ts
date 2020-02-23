import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";
import Base from "./base.ent";

@Entity()
class User extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: "", nullable: true })
  firstName: string;

  @Column({ default: "", nullable: true })
  lastName: string;
}

export default User;
