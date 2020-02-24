import {
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import User from "./user.ent";

abstract class Base extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "LOCALTIMESTAMP"
  })
  createdAt: string;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "LOCALTIMESTAMP"
  })
  updatedAt: string;

  @ManyToOne(
    () => User,
    () => [],
    { eager: true }
  )
  createdBy: User;
}

export default Base;
