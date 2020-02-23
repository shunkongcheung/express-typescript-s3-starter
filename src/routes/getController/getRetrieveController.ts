import { NextFunction, Request, Response } from "express";
import { BaseEntity } from "typeorm";
import { param } from "express-validator";

import flattenCreatedBy from "./flattenCreatedBy";

interface Props<
  EntityType extends typeof BaseEntity,
  EntityShape extends BaseEntity
> {
  model: EntityType;
  getEntity?: GetEntity<EntityType, EntityShape>;
}

type GetEntity<T extends typeof BaseEntity, S extends object> = (
  model: T,
  req: Request
) => Promise<null | S>;

const defaultGetEntity = async <
  EntityType extends typeof BaseEntity,
  EntityShape extends BaseEntity
>(
  model: EntityType,
  req: Request
) => model.findOne(req.params.id) as Promise<EntityShape>;

const getRetrieveController = <
  EntityType extends typeof BaseEntity,
  EntityShape extends BaseEntity
>({
  model,
  getEntity = defaultGetEntity
}: Props<EntityType, EntityShape>) => {
  const retrieveValidation = [param("id").isString()];

  const retrieveEntity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const entity = await getEntity(model, req);
      if (!entity) return next("Entity does not exist");

      return res.status(200).json(flattenCreatedBy(entity));
    } catch (err) {
      next(err.message);
    }
  };

  return { retrieveValidation, retrieveEntity };
};

export default getRetrieveController;
