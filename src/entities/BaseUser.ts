import { Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

class BaseUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;
}

export default BaseUser;
