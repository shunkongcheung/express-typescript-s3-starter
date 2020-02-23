import { NextFunction, Router, Request, Response } from "express";
import { matchedData, ValidationChain, param } from "express-validator";

import { validateRequest } from "../middlewares";
import { BaseEntity } from "typeorm";
import { auth } from "../middlewares";

type Method = "list" | "retrieve" | "create" | "update" | "delete";

interface ModelControllerProps<EntityShape extends typeof BaseEntity> {
  allowedMethods?: Array<Method>;
  authenticated?: boolean;
  model: EntityShape;
  validations?: { [x: string]: Array<ValidationChain> };
}

const isAllowed = (allowedMethods: Array<Method>, method: Method) =>
  !allowedMethods || allowedMethods.includes(method);

interface TransformedData {
  [x: string]: any;
}

class ModelController<EntityShape extends typeof BaseEntity> {
  protected model: EntityShape;
  protected router = Router();

  private allowedMethods: Array<Method> | undefined;
  private authenticated: boolean;
  private validations: { [x: string]: Array<ValidationChain> } | undefined;

  constructor(props: ModelControllerProps<EntityShape>) {
    const { allowedMethods, authenticated, model, validations } = props;
    const router = Router();
    this.router = router;

    this.allowedMethods = allowedMethods;
    this.authenticated = authenticated !== false; // undefined / null / true will be true
    this.model = model;
    this.validations = {
      create: validations?.create ?? [],
      update: [param("id").isString()].concat(validations?.update ?? []),
      retrieve: [param("id").isString()].concat(validations?.retrieve ?? []),
      list: validations?.list ?? [],
      delete: [param("id").isString()]
    };
  }

  // getter
  public getRouter = () => {
    const allowedMethods = this.allowedMethods;
    const authenticated = this.authenticated;
    const validations = this.validations;
    const router = this.router;

    const emptyMiddleware = (_, __, next: NextFunction) => next();

    if (isAllowed(allowedMethods || [], "create"))
      router.post(
        "/",
        authenticated ? auth : emptyMiddleware,
        validations.create,
        validateRequest,
        this.createEntity
      );

    if (isAllowed(allowedMethods || [], "delete"))
      router.delete(
        "/:id",
        authenticated ? auth : emptyMiddleware,
        validations.delete,
        validateRequest,
        this.deleteEntity
      );

    if (isAllowed(allowedMethods || [], "list"))
      router.get(
        "/",
        authenticated ? auth : emptyMiddleware,
        validations.list,
        validateRequest,
        this.listEntities
      );

    if (isAllowed(allowedMethods || [], "update"))
      router.put(
        "/:id",
        authenticated ? auth : emptyMiddleware,
        validations.update,
        validateRequest,
        this.updateEntity
      );

    if (isAllowed(allowedMethods || [], "retrieve"))
      router.get(
        "/:id",
        authenticated ? auth : emptyMiddleware,
        validations["retrieve"] || [],
        validateRequest,
        this.retieveEntityById
      );

    return this.router;
  };

  // protected methods to be overwrite
  protected getEntity = async (req: Request): Promise<null | BaseEntity> =>
    this.model.findOne(req.params.id);

  protected filterEntities = async (req: Request) => this.model.find();

  protected transformCreateData = async (
    entityData: TransformedData,
    req: Request
  ): Promise<TransformedData | [TransformedData | null, TransformedData]> =>
    entityData;

  protected transformUpdateData = async (
    entityData: TransformedData,
    req: Request
  ): Promise<TransformedData | [TransformedData, TransformedData]> =>
    entityData;

  // private methods
  private createEntity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const entityData = matchedData(req);
      const transformRet = await this.transformCreateData(entityData, req);

      const saveData = Array.isArray(transformRet)
        ? transformRet[0]
        : transformRet;

      const respondData = Array.isArray(transformRet)
        ? transformRet[1]
        : transformRet;

      // if saveData is null, that means it is not a model action, just a regular post request
      // in such case, simply return without hitting the database
      if (saveData === null) return res.status(201).json(respondData);

      // regular flow
      const entity = new this.model();
      Object.entries(saveData).map(([key, value]) => (entity[key] = value));

      const result = await entity.save();

      const idData = { id: (result as any).id };
      const catRespondData = Object.assign({}, respondData, idData);
      res.status(201).json(catRespondData);
    } catch (err) {
      next(err.message);
    }
  };

  private deleteEntity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const entity = await this.model.findOne(id);
      if (!entity) return next("Entity does not exist");

      await this.model.remove(entity);
      res.status(204).json({});
    } catch (err) {
      next(err.message);
    }
  };

  private listEntities = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = this.filterEntities(req);
      return res.status(200).json(result);
    } catch (err) {
      next(err.message);
    }
  };

  private retieveEntityById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const entity = await this.getEntity(req);
      if (!entity) return next("Entity does not exist");

      return res.status(200).json(entity);
    } catch (err) {
      next(err.message);
    }
  };

  private updateEntity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const transformRet = await this.transformUpdateData(req.body, req);

      const saveData = Array.isArray(transformRet)
        ? transformRet[0]
        : transformRet;

      const respondData = Array.isArray(transformRet)
        ? transformRet[1]
        : transformRet;

      const entity = await this.model.findOne(id);
      Object.entries(saveData).map(([key, value]) => (entity[key] = value));
      await entity.save();

      return res.status(202).json(respondData);
    } catch (err) {
      return next(err.message);
    }
  };
}

export default ModelController;
