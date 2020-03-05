import { body } from "express-validator";

import getController from "../getController";
import { Todo } from "../entities";

const validations = [
  body("name").isString(),
  body("content").isString(),
  (req: any, res: any, next: any) => next()
];

const controller = getController({
  model: Todo,
  validations: { create: validations, update: validations } as any
});

export default controller;
