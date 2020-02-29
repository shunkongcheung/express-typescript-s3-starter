import getController, { Props as GetControllerProps } from "./getController";
import { BaseEntity } from "typeorm";

import { BaseUser } from "./entities";

type GetControllerCatProps<
  T extends typeof BaseEntity,
  S extends BaseEntity
> = Omit<GetControllerProps<T, S>, "userModel">;

function getControllerWithUser<UserType extends typeof BaseUser>(
  userModel: UserType
) {
  const getControllerConcat = <
    T extends typeof BaseEntity,
    S extends BaseEntity
  >(
    props: GetControllerCatProps<T, S>
  ) => getController({ ...props, userModel });

  return getControllerConcat;
}

export default getControllerWithUser;
