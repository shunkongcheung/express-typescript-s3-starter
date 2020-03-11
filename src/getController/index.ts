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

interface Authenticated {
  list?: boolean;
  retrieve?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

interface ListParams {
  skip: number;
  take: number;
  order?: { [x: string]: "DESC" | "ASC" };
  where?: Array<{ [key: string]: any }>;
}

export interface Props<
  EntityType extends typeof BaseEntity,
  EntityShape extends BaseEntity
> {
  allowedMethods?: Array<Method>;
  authenticated?: boolean | Authenticated;
  filterEntities?: FilterEntities<EntityType>;
  getEntity?: GetEntity<EntityType>;
  model: EntityType;
  onDelete?: OnDelete<EntityShape>;
  retrieveUrl?: string;
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
  p: ListParams,
  r: Request
) => Promise<[Array<any>, number]>;

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

const getAuthObj = (
  authenticated?: boolean | Authenticated
): Required<Authenticated> => {
  if (authenticated === null || authenticated === undefined)
    authenticated = true;

  if (typeof authenticated === "object")
    return {
      list: authenticated.list !== false,
      retrieve: authenticated.retrieve !== false,
      create: authenticated.create !== false,
      update: authenticated.update !== false,
      delete: authenticated.delete !== false
    };
  else
    return {
      list: authenticated !== false,
      retrieve: authenticated !== false,
      create: authenticated !== false,
      update: authenticated !== false,
      delete: authenticated !== false
    };
};

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
  const defaultRetrieveUrl = "/:id";
  const {
    allowedMethods,
    authenticated,
    filterEntities,
    getEntity,
    model,
    onDelete,
    retrieveUrl = defaultRetrieveUrl,
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
    retrieve: (validations?.retrieve ?? []).concat(
      retrieveUrl === defaultRetrieveUrl ? retrieveValidation : []
    ),
    update: (validations?.update ?? []).concat(defaultUpdateValidation)
  };
  const { getOptions } = getOptionsController({
    allowedMethods,
    authenticated,
    validations: fVals
  });

  const router = Router();
  const auth = getAuthObj(authenticated);

  if (isAllowed("create", allowedMethods))
    addRoute(router, "post", "/", auth.create, u, fVals.create, createEntity);

  if (isAllowed("delete", allowedMethods))
    addRoute(
      router,
      "delete",
      "/:id",
      auth.delete,
      u,
      fVals.delete,
      deleteEntity
    );

  if (isAllowed("list", allowedMethods))
    addRoute(router, "get", "/", auth.list, u, fVals.list, listEntities);

  if (isAllowed("retrieve", allowedMethods))
    addRoute(
      router,
      "get",
      retrieveUrl,
      auth.retrieve,
      u,
      fVals.retrieve,
      retrieveEntity
    );

  if (isAllowed("update", allowedMethods))
    addRoute(router, "put", "/:id", auth.update, u, fVals.update, updateEntity);

  router.options("/", getOptions);

  return router;
};

export default getController;
