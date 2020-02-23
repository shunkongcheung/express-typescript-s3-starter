import { NextFunction, Request, Response } from "express";
import { BaseEntity } from "typeorm";
import { matchedData, param } from "express-validator";

interface Props<
  EntityShapeType extends typeof BaseEntity,
  EntityShape extends BaseEntity
> {
  model: EntityShapeType;
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
  EntityShapeType extends typeof BaseEntity,
  EntityShape extends BaseEntity
>({
  model,
  transformUpdateData = defaultTransformUpdateData
}: Props<EntityShapeType, EntityShape>) => {
  const defaultUpdateValidation = [param("id").isNumeric()];

  const updateEntity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const entity = await model.findOne(id);
      const entityData = matchedData(req);
      const transformRet = await transformUpdateData(
        entityData,
        (entity as unknown) as EntityShape
      );

      const saveData = Array.isArray(transformRet)
        ? transformRet[0]
        : transformRet;

      const respondData = Array.isArray(transformRet)
        ? transformRet[1]
        : transformRet;

      await model.update({ id } as any, saveData);

      return res.status(202).json(respondData);
    } catch (err) {
      next(err.message);
    }
  };

  return { defaultUpdateValidation, updateEntity };
};

export default getUpdateController;
