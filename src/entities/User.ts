import { Column, Entity, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
