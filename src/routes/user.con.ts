import { body } from "express-validator";
import { Request } from "express";

import getController from "./getController";
import { User } from "../entities";

// TODO: User is not a good example. Create a better one
interface Data {
  firstName: string;
  lastName: string;
}

const validations = [
  body("firstName")
    .isString()
    .optional(),
  body("lastName")
    .isString()
    .optional()
];

const getEntity = async (model: typeof User, req: Request) => {
  const { id } = req.params;
  const user = await model.findOne(id);
  const respond: User = Object.assign({}, user);
  delete respond.password;
  return respond;
};

const transformUpdateData = async (e: Data, entity: User) => {
  const transformed = {
    lastName: e.lastName || "",
    firstName: e.firstName || ""
  };
  const respond: User = Object.assign({}, entity);
  delete respond.password;
  return [transformed, respond];
};

const controller = getController<typeof User, User>({
  model: User,
  getEntity,
  transformUpdateData,
  validations: {
    update: validations
  }
});

export default controller;
