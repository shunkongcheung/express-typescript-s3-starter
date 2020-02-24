import { NextFunction, Request, Response } from "express";
import { BaseEntity } from "typeorm";
import { param } from "express-validator";

interface Props<
  EntityType extends typeof BaseEntity,
  EntityShape extends BaseEntity
> {
  model: EntityType;
  onDelete?: OnDelete<EntityShape>;
}

type OnDelete<EntityShape extends BaseEntity> = (
  id: number,
  entity: EntityShape,
  req: Request
) => any;

const getDeleteController = <
  EntityType extends typeof BaseEntity,
  EntityShape extends BaseEntity
>({
  model,
  onDelete = () => {}
}: Props<EntityType, EntityShape>) => {
  const deleteValidation = [param("id").isString()];

  const deleteEntity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const entity = (await model.findOne(id)) as EntityShape;
      if (!entity) return next("Entity does not exist");

      await onDelete(Number(id), entity, req);
      await model.remove(entity);
      res.status(204).json({});
    } catch (err) {
      next(err.message);
    }
  };

  return { deleteValidation, deleteEntity };
};

export default getDeleteController;
