import { NextFunction, Request, Response } from "express";
import { BaseEntity } from "typeorm";
import { param } from "express-validator";

interface Props<EntityType extends typeof BaseEntity> {
  model: EntityType;
}

const getDeleteController = <EntityType extends typeof BaseEntity>({
  model
}: Props<EntityType>) => {
  const deleteValidation = [param("id").isString()];

  const deleteEntity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const entity = await model.findOne(id);
      if (!entity) return next("Entity does not exist");

      await model.remove(entity);
      res.status(204).json({});
    } catch (err) {
      next(err.message);
    }
  };

  return { deleteValidation, deleteEntity };
};

export default getDeleteController;
