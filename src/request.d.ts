import { BaseUser } from "./entities";
declare global {
  namespace Express {
    export interface Request {
      user?: BaseUser;
    }
  }
}
