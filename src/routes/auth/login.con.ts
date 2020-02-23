import { body } from "express-validator";
import * as bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";

import ModelController from "../model.con";
import { User } from "../../entities";

const loginValidator = [
  body("username").isString(),
  body("password").isString()
];

class LoginController extends ModelController<typeof User> {
  constructor() {
    super({
      model: User,
      allowedMethods: ["create"],
      validations: { create: loginValidator }
    });
  }

  protected transformCreateData = async (data: User) => {
    const { username, password } = data;
    const user = await this.model.findOne({ username });
    if (!user) throw { message: "Invalid username" };

    const match = await bcryptjs.compare(password, user.password);
    if (!match) throw { message: "Invalid password" };

    const tokenData = { ...user };
    delete tokenData.password;

    const token = jwt.sign(tokenData, process.env.JWT_SECRET);

    return [null, { token }];
  };
}

const controller = new LoginController();

export default controller.getRouter();
