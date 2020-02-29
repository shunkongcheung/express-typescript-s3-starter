import {
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import BaseUser from "./BaseUser";

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
}

function getBaseEntity<UserType extends typeof BaseUser>(
  userModel: UserType
): typeof Base {
  abstract class BaseFinal extends Base {
    @ManyToOne(
      () => userModel,
      () => [],
      { eager: true }
    )
    createdBy: UserType;
  }
  return BaseFinal;
}

export default getBaseEntity;
