import { body } from "express-validator";
import * as bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";

import { BaseUser } from "../../entities";
import getController from "../../getController";

const loginValidator = [
  body("username").isString(),
  body("password").isString()
];

function getLogin<User extends BaseUser, UserType extends typeof BaseUser>(
  userModel: UserType
) {
  const transformCreateData = async (data: User) => {
    const { username, password } = data;
    const user = await userModel.findOne({ username });
    if (!user) throw { message: "Invalid username" };

    const match = await bcryptjs.compare(password, user.password);
    if (!match) throw { message: "Invalid password" };

    const tokenData = { ...user };
    delete tokenData.password;

    const token = jwt.sign(tokenData, process.env.JWT_SECRET);

    return [null, { token }];
  };

  const controller = getController({
    model: userModel,
    allowedMethods: ["create"],
    authenticated: false,
    transformCreateData,
    userModel,
    validations: { create: loginValidator }
  });

  return controller;
}

export default getLogin;
