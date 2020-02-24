import { Entity, Column } from "typeorm";

import Base from "./Base";

@Entity()
class File extends Base {
  @Column()
  name: string;

  @Column()
  fileType: "image" | "document";

  @Column()
  s3Key: string;

  @Column("text")
  url: string; // url to s3
}

export default File;
