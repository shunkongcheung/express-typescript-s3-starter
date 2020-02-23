import { Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
abstract class Base extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}

export default Base;
