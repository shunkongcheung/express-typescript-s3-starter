import { NextFunction, Router, Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { BaseEntity } from "typeorm";

import getCreateController from "./getCreateController";
import getDeleteController from "./getDeleteController";
import getListController from "./getListController";
import getOptionsController from "./getOptionsController";
import getRetrieveController from "./getRetrieveController";
import getUpdateController from "./getUpdateController";
import { getAuthMiddleware, validateRequest } from "../middlewares";
import { BaseUser } from "../entities";

type Action = (req: Request, res: Response, next: NextFunction) => any;

type Method = "list" | "retrieve" | "create" | "update" | "delete";

export interface Props<
  EntityType extends typeof BaseEntity,
  EntityShape extends BaseEntity
> {
  allowedMethods?: Array<Method>;
  authenticated?: boolean;
  filterEntities?: FilterEntities<EntityType>;
  getEntity?: GetEntity<EntityType>;
  model: EntityType;
  onDelete?: OnDelete<EntityShape>;
  transformCreateData?: TCreateData;
  transformUpdateData?: TUpdateData<EntityShape>;
  userModel: typeof BaseUser;
  validations?: { [x: string]: Array<ValidationChain> };
}

interface Data {
  [x: string]: any;
}

type FilterEntities<T extends typeof BaseEntity> = (
  m: T,
  p: object,
  r: Request
) => Promise<Array<any>>;

type GetEntity<T extends typeof BaseEntity> = (
  model: T,
  req: Request
) => Promise<null | object | Buffer>;

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

const addRoute = <T extends typeof BaseUser>(
  router: any,
  method: "get" | "put" | "post" | "delete",
  route: string,
  isAuth: boolean,
  userModel: T,
  validation: Array<ValidationChain>,
  action: Action
) => {
  const emptyMiddleware = (_: any, __: any, next: NextFunction) => next();
  router[method](
    route,
    isAuth ? getAuthMiddleware(userModel) : emptyMiddleware,
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
    userModel: u,
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

  const fVals = {
    create: validations.create,
    delete: deleteValidation,
    list: (validations?.list ?? []).concat(defaultListValidation),
    retrieve: (validations?.retrieve ?? []).concat(retrieveValidation),
    update: (validations?.update ?? []).concat(defaultUpdateValidation)
  };
  const { getOptions } = getOptionsController({
    allowedMethods,
    authenticated,
    validations: fVals
  });

  const router = Router();
  const isAuth = authenticated !== false; // undefined / null / true will be true

  if (isAllowed("create", allowedMethods))
    addRoute(router, "post", "/", isAuth, u, fVals.create, createEntity);

  if (isAllowed("delete", allowedMethods))
    addRoute(router, "delete", "/:id", isAuth, u, fVals.delete, deleteEntity);

  if (isAllowed("list", allowedMethods))
    addRoute(router, "get", "/", isAuth, u, fVals.list, listEntities);

  if (isAllowed("retrieve", allowedMethods))
    addRoute(router, "get", "/:id", isAuth, u, fVals.retrieve, retrieveEntity);

  if (isAllowed("update", allowedMethods))
    addRoute(router, "put", "/:id", isAuth, u, fVals.update, updateEntity);

  router.options("/", getOptions);

  return router;
};

export default getController;
