import getController, { Props as GetControllerProps } from "./getController";
import { BaseEntity } from "typeorm";

import { BaseUser } from "./entities";

type GetControllerWithUserProps<
  T extends typeof BaseEntity,
  S extends BaseEntity
> = Omit<GetControllerProps<T, S>, "userModel">;

function getControllerWithUser<UserType extends typeof BaseUser>(
  userModel: UserType
) {
  const getControllerWithUser = <
    T extends typeof BaseEntity,
    S extends BaseEntity
  >(
    props: GetControllerWithUserProps<T, S>
  ) => getController({ ...props, userModel });

  return getControllerWithUser;
}

export default getControllerWithUser;
