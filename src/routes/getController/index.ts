import { NextFunction, Router, Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { BaseEntity } from "typeorm";

import getCreateController from "./getCreateController";
import getDeleteController from "./getDeleteController";
import getListController from "./getListController";
import getRetrieveController from "./getRetrieveController";
import getUpdateController from "./getUpdateController";
import { auth, validateRequest } from "../../middlewares";

type Action = (req: Request, res: Response, next: NextFunction) => any;

type Method = "list" | "retrieve" | "create" | "update" | "delete";

interface Props<
  EntityType extends typeof BaseEntity,
  EntityShape extends BaseEntity
> {
  allowedMethods?: Array<Method>;
  authenticated?: boolean;
  filterEntities?: FilterEntities;
  getEntity?: GetEntity<EntityType>;
  model: EntityType;
  onDelete?: OnDelete<EntityShape>;
  transformCreateData?: TCreateData;
  transformUpdateData?: TUpdateData<EntityShape>;
  validations?: { [x: string]: Array<ValidationChain> };
}

interface Data {
  [x: string]: any;
}

type FilterEntities = <T extends typeof BaseEntity>(
  m: T,
  r: Request
) => Promise<Array<BaseEntity>>;

type GetEntity<T extends typeof BaseEntity> = (
  model: T,
  req: Request
) => Promise<null | object>;

type OnDelete<EntityShape extends BaseEntity> = (
  entity: EntityShape,
  req: Request
) => any;

type TCreateData = (e: Data, r: Request) => Promise<Data | [Data | null, Data]>;

type TUpdateData<T extends BaseEntity> = (
  e: Data,
  r: T
) => Promise<Data | [Data, Data]>;

const isAllowed = (method: Method, allowedMethods: Array<Method>) =>
  !allowedMethods || allowedMethods.includes(method);

const addRoute = (
  router: any,
  method: "get" | "put" | "post" | "delete",
  route: string,
  isAuth: boolean,
  validation: Array<ValidationChain>,
  action: Action
) => {
  const emptyMiddleware = (_: any, __: any, next: NextFunction) => next();
  router[method](
    route,
    isAuth ? auth : emptyMiddleware,
    validation || emptyMiddleware,
    validateRequest,
    action
  );
};

const getController = <
  EntityType extends typeof BaseEntity,
  EntityShape extends BaseEntity
>(
  props: Props<EntityType, EntityShape>
) => {
  const {
    allowedMethods,
    authenticated,
    filterEntities,
    getEntity,
    model,
    onDelete,
    transformCreateData,
    transformUpdateData,
    validations = {}
  } = props;

  const { createEntity } = getCreateController({ model, transformCreateData });
  const { deleteValidation, deleteEntity } = getDeleteController({
    model,
    onDelete
  });
  const { listEntities, defaultListValidation } = getListController({
    model,
    filterEntities
  });
  const { retrieveValidation, retrieveEntity } = getRetrieveController({
    model,
    getEntity
  });
  const { defaultUpdateValidation, updateEntity } = getUpdateController({
    model,
    transformUpdateData
  });

  const router = Router();
  const isAuth = authenticated !== false; // undefined / null / true will be true

  if (isAllowed("create", allowedMethods))
    addRoute(router, "post", "/", isAuth, validations.create, createEntity);

  if (isAllowed("delete", allowedMethods))
    addRoute(router, "delete", "/:id", isAuth, deleteValidation, deleteEntity);

  if (isAllowed("list", allowedMethods)) {
    const listVal = (validations?.list ?? []).concat(defaultListValidation);
    addRoute(router, "get", "/", isAuth, listVal, listEntities);
  }
  if (isAllowed("retrieve", allowedMethods)) {
    const retVal = (validations?.retrieve ?? []).concat(retrieveValidation);
    addRoute(router, "get", "/:id", isAuth, retVal, retrieveEntity);
  }

  if (isAllowed("update", allowedMethods)) {
    const upVal = (validations?.update ?? []).concat(defaultUpdateValidation);
    addRoute(router, "put", "/:id", isAuth, upVal, updateEntity);
  }

  return router;
};

export default getController;
