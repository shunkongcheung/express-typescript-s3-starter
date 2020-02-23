import { body } from "express-validator";
import * as bcryptjs from "bcryptjs";

import ModelController from "../model.con";
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

class RegisterController extends ModelController<typeof User> {
  constructor() {
    super({
      model: User,
      allowedMethods: ["create"],
      validations: { create: registerValidator }
    });
  }

  protected transformCreateData = async (user: User) => {
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
}

const controller = new RegisterController();

export default controller.getRouter();
