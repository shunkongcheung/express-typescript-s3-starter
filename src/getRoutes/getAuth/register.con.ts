import { body } from "express-validator";
import * as bcryptjs from "bcryptjs";

import getController from "../../getController";
import { BaseUser } from "../../entities";

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

function getRegister<User extends BaseUser, UserType extends typeof BaseUser>(
  userModel: UserType
) {
  const transformCreateData = async (user: User) => {
    const { username, password } = user;
    const data = await userModel.find({ username });
    if (Array.isArray(data) && data.length > 0)
      throw { message: "Username already exists" };

    const saltRounds = Number(process.env.SALT_ROUNDS || "2");
    const extendedData = {
      ...user,
      password: bcryptjs.hashSync(password, saltRounds)
    };
    const entity = Object.assign(new userModel(), extendedData);
    await entity.save();

    const retData = { ...user, id: entity.id };
    delete retData.password;

    return [null, retData];
  };

  const controller = getController({
    model: userModel,
    allowedMethods: ["create"],
    authenticated: false,
    transformCreateData,
    userModel,
    validations: { create: registerValidator }
  });

  return controller;
}

export default getRegister;
