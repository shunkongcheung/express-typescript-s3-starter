import { body } from "express-validator";
import { Request } from "express";

import getController from "./getController";
import { Todo } from "../entities";

const validations = [body("name").isString(), body("content").isString()];

const getEntity = async (model: typeof Todo, req: Request) => {
  const { id } = req.params;
  const entity = await model.findOne(id);

  const author = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    id: req.user.id
  };

  const respond: Todo & { author: any } = Object.assign(entity, { author });
  return respond;
};

const controller = getController<typeof Todo, Todo>({
  model: Todo,
  getEntity,
  validations: { create: validations, update: validations }
});

export default controller;
