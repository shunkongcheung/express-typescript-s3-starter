import { body } from "express-validator";

import getController from "../../src/getController";

import { Todo, User } from "../entities";

const validations = [body("name").isString(), body("content").isString()];

const controller = getController<typeof Todo, Todo, typeof User>({
  model: Todo,
  validations: { create: validations, update: validations },
  userModel: User
});

export default controller;
