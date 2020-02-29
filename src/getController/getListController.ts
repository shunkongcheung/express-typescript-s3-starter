import { NextFunction, Request, Response } from "express";
import { query } from "express-validator";
import { BaseEntity } from "typeorm";

import flattenCreatedBy from "./flattenCreatedBy";

interface ListParams {
  skip: number;
  take: number;
  order?: { [x: string]: "DESC" | "ASC" };
  where?: Array<{ [key: string]: any }>;
}

interface Props<EntityType extends typeof BaseEntity> {
  filterEntities?: FilterEntities<EntityType>;
  model: EntityType;
}

type FilterEntities<EntityType extends typeof BaseEntity> = (
  model: EntityType,
  listParams: ListParams,
  req: Request
) => Promise<Array<any>>;

const defaultFilterEntities = async <EntityType extends typeof BaseEntity>(
  model: EntityType,
  listParams: object
) => {
  return model.find(listParams);
};

const getListController = <EntityType extends typeof BaseEntity>({
  model,
  filterEntities = defaultFilterEntities
}: Props<EntityType>) => {
  const listEntities = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        page = 1,
        pageSize = 10,
        order = "createdAt",
        orderDir = "DESC"
      } = req.query;
      const { user } = req;

      const orderVal = orderDir === "ASC" ? "ASC" : "DESC";
      const listParams: ListParams = {
        skip: Number(pageSize) * (Number(page) - 1),
        take: Number(pageSize),
        order: order ? { [order]: orderVal as "ASC" | "DESC" } : undefined
      };
      if (user) listParams.where = [{ createdBy: user.id }];

      const results = await filterEntities(model, listParams, req);
      res.status(200).json(flattenCreatedBy(results));
      next();
    } catch (err) {
      next(err.message);
    }
  };

  const defaultListValidation = [
    query("page")
      .isNumeric()
      .optional(),
    query("pageSize")
      .isNumeric()
      .optional(),
    query("order")
      .isString()
      .optional(),
    query("orderDir")
      .isIn(["ASC", "DESC"])
      .optional()
  ];

  return { listEntities, defaultListValidation };
};

export default getListController;
