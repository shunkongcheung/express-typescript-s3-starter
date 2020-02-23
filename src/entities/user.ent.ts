import { Column, PrimaryGeneratedColumn } from "typeorm";
import Base from "./base.ent";

class User extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: "", nullable: true })
  firstName?: string;

  @Column({ default: "", nullable: true })
  lastName?: string;

  @Column()
  email: string;
}

export default User;
