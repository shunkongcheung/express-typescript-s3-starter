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
  const deleteValidation = [param("id").isNumeric()];

  const deleteEntity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const filterParams: any = { id: Number(id) };
      const { user } = req;
      if (user) filterParams.createdBy = user.id;

      const entity = (await model.findOne(filterParams)) as EntityShape;
      if (!entity) return next("Entity does not exist");

      await onDelete(entity, req);
      await model.remove(entity);
      res.status(204).json({});
      next();
    } catch (err) {
      next(err.message);
    }
  };

  return { deleteValidation, deleteEntity };
};

export default getDeleteController;
