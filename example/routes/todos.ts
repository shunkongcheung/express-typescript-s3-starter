import { body } from "express-validator";

import getController from "../getController";
import { Todo } from "../entities";

const validations = [body("name").isString(), body("content").isString()];

const controller = getController({
  model: Todo,
  validations: { create: validations, update: validations }
});

export default controller;
