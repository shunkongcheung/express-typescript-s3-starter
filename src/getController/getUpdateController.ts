import { NextFunction, Request, Response } from "express";
import { BaseEntity } from "typeorm";
import { matchedData, param } from "express-validator";

interface Props<
  EntityType extends typeof BaseEntity,
  EntityShape extends BaseEntity
> {
  model: EntityType;
  transformUpdateData?: TransformUpdateData<EntityShape>;
}

interface TransformedData {
  [x: string]: any;
}

type TransformUpdateData<T extends BaseEntity> = (
  entityData: TransformedData,
  entity: T
) => Promise<TransformedData | [TransformedData, TransformedData]>;

const defaultTransformUpdateData: TransformUpdateData<any> = async entityData =>
  entityData;

const getUpdateController = <
  EntityType extends typeof BaseEntity,
  EntityShape extends BaseEntity
>({
  model,
  transformUpdateData = defaultTransformUpdateData
}: Props<EntityType, EntityShape>) => {
  const defaultUpdateValidation = [param("id").isNumeric()];

  const updateEntity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const params: any = { id: Number(id) };
      if (req.user) params.createdBy = req.user.id;

      const entity = (await model.findOne(params)) as any;
      if (!entity) return next("Entity does not exist");

      const entityData = matchedData(req);
      const transformRet = await transformUpdateData(entityData, entity);

      const saveData = Array.isArray(transformRet)
        ? transformRet[0]
        : transformRet;

      const respondData = Array.isArray(transformRet)
        ? transformRet[1]
        : { ...entity, ...transformRet };

      await model.update({ id } as any, saveData);

      const idData = {
        id: entity.id,
        createdAt: entity.createdAt,
        createdBy: entity.createdBy.id,
        updatedAt: new Date()
      };
      const catRespondData = Object.assign({}, respondData, idData);

      res.status(202).json(catRespondData);
      next();
    } catch (err) {
      next(err.message);
    }
  };

  return { defaultUpdateValidation, updateEntity };
};

export default getUpdateController;
