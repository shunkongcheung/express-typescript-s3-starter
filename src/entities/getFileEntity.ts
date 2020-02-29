import { Column } from "typeorm";

import BaseUser from "./BaseUser";
import getBaseEntity from "./getBaseEntity";

function getFileEntity<T extends typeof BaseUser>(userModel: T): any {
  class BaseFile extends getBaseEntity(userModel) {
    @Column()
    name: string;

    @Column()
    fileType: "image" | "document";

    @Column()
    s3Key: string;

    @Column("text")
    url: string; // url to s3
  }
  return BaseFile;
}

export default getFileEntity;
