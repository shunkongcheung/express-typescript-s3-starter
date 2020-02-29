import { Entity } from "typeorm";
import { getFileEntity } from "../../src";
import User from "./User";

const BaseFile = getFileEntity(User);

@Entity()
class File extends BaseFile {}

export default File;
