import { NextFunction, Request, Response } from "express";
import { BaseEntity } from "typeorm";
import { param } from "express-validator";

import flattenCreatedBy from "./flattenCreatedBy";

interface Props<EntityType extends typeof BaseEntity> {
  model: EntityType;
  getEntity?: GetEntity<EntityType>;
}

type GetEntity<T extends typeof BaseEntity> = (
  model: T,
  req: Request
) => Promise<null | object>;

const defaultGetEntity = async <
  EntityType extends typeof BaseEntity,
  S extends object
>(
  model: EntityType,
  req: Request
) => model.findOne(req.params.id) as Promise<S>;

const getRetrieveController = <EntityType extends typeof BaseEntity>({
  model,
  getEntity = defaultGetEntity
}: Props<EntityType>) => {
  const retrieveValidation = [param("id").isString()];

  const retrieveEntity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const entity = await getEntity(model, req);
      if (!entity) return next("Entity does not exist");

      res.status(200).json(flattenCreatedBy(entity));
      next();
    } catch (err) {
      next(err.message);
    }
  };

  return { retrieveValidation, retrieveEntity };
};

export default getRetrieveController;
