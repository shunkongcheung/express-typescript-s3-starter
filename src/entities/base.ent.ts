import { PrimaryGeneratedColumn, BaseEntity } from "typeorm";

abstract class Base extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}

export default Base;
