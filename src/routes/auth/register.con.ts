import { body } from "express-validator";
import * as bcryptjs from "bcryptjs";

import getController from "../getController";
import { User } from "../../entities";

const registerValidator = [
  body("username").isString(),
  body("password").isString(),
  body("email").isString(),
  body("firstName")
    .isString()
    .optional(),
  body("lastName")
    .isString()
    .optional()
];

const transformCreateData = async (user: User) => {
  const { username, password } = user;
  const data = await this.model.find({ username });
  if (Array.isArray(data) && data.length > 0)
    throw { message: "Username already exists" };

  const saltRounds = Number(process.env.SALT_ROUNDS || "2");
  const extendedData = {
    firstName: "",
    lastName: "",
    ...user,
    password: bcryptjs.hashSync(password, saltRounds)
  };

  const retData = { ...user };
  delete retData.password;

  return [extendedData, retData];
};

const controller = getController({
  model: User,
  allowedMethods: ["create"],
  authenticated: false,
  transformCreateData,
  validations: { create: registerValidator }
});

export default controller;
