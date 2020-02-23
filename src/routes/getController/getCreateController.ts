import { NextFunction, Request, Response } from "express";
import { BaseEntity } from "typeorm";
import { matchedData } from "express-validator";

interface Props<EntityType extends typeof BaseEntity> {
  model: EntityType;
  transformCreateData?: TransformCreateData;
}

interface TransformedData {
  [x: string]: any;
}

type TransformCreateData = (
  entityData: TransformedData
) => Promise<TransformedData | [TransformedData | null, TransformedData]>;

const defaultTransformCreateData: TransformCreateData = async entityData =>
  entityData;

const getCreateController = <EntityType extends typeof BaseEntity>({
  model,
  transformCreateData = defaultTransformCreateData
}: Props<EntityType>) => {
  const createEntity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const entityData = matchedData(req);
      const transformRet = await transformCreateData(entityData);

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
      const entity = new model();
      Object.entries(saveData).map(([key, value]) => (entity[key] = value));

      const result = await entity.save();

      const idData = { id: (result as any).id };
      const catRespondData = Object.assign({}, respondData, idData);
      res.status(201).json(catRespondData);
    } catch (err) {
      next(err.message);
    }
  };

  return { createEntity };
};

export default getCreateController;
