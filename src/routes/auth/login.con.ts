import { body } from "express-validator";
import * as bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";

import getController from "../getController";
import { User } from "../../entities";

const loginValidator = [
  body("username").isString(),
  body("password").isString()
];

const transformCreateData = async (data: User) => {
  const { username, password } = data;
  const user = await User.findOne({ username });
  if (!user) throw { message: "Invalid username" };

  const match = await bcryptjs.compare(password, user.password);
  if (!match) throw { message: "Invalid password" };

  const tokenData = { ...user };
  delete tokenData.password;

  const token = jwt.sign(tokenData, process.env.JWT_SECRET);

  return [null, { token }];
};

const controller = getController({
  model: User,
  allowedMethods: ["create"],
  authenticated: false,
  transformCreateData,
  validations: { create: loginValidator }
});

export default controller;
