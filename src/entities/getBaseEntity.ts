import {
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import BaseUser from "./BaseUser";

function getBaseEntity<UserType extends typeof BaseUser>(
  userModel: UserType
): typeof BaseEntity {
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
      () => userModel,
      () => [],
      { eager: true }
    )
    createdBy: UserType;
  }
  return (Base as unknown) as typeof BaseEntity;
}

export default getBaseEntity;
