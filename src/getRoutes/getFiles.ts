import { Request, Response, NextFunction } from "express";
import AWS from "aws-sdk";
import * as jwt from "jsonwebtoken";
import multer from "multer";
import { BaseEntity } from "typeorm";

import getController from "../getController";
import { BaseUser } from "../entities";
import { query } from "express-validator";

function getFiles<U extends typeof BaseUser, F extends typeof BaseEntity>(
  userModel: U,
  File: F
) {
  const authQueryValidator = query("token").isString();

  const authByQueryMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { JWT_SECRET = "" } = process.env;
    const token = req.query["token"];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const { username } = decoded as { username: string };
      const user = await userModel.findOne({ username });
      (req as any).user = user;
      next();
    } catch (err) {
      next(err);
    }
  };

  const fileMiddleware = multer({
    limits: {
      fileSize: 1000000
    }
  }).single("file");

  const getS3 = () => {
    const BUCKET_NAME = process.env.S3_BUCKET_NAME;
    AWS.config.update({
      accessKeyId: process.env.S3_ACCESS_ID,
      secretAccessKey: process.env.S3_SECRET_KEY
    });
    const s3 = new AWS.S3();
    const ret: [AWS.S3, string] = [s3, BUCKET_NAME];
    return ret;
  };

  const deleteInS3 = async (Key: string) => {
    const [s3, Bucket] = getS3();
    const params = { Bucket, Key };
    return s3.deleteObject(params).promise();
  };

  const downloadFromS3 = async (Key: string) => {
    const [s3, Bucket] = getS3();
    const params = { Bucket, Key };
    const data = await s3.getObject(params).promise();
    const buffer = data.Body as Buffer; // Use the encoding necessary
    return buffer;
  };

  const uploadToS3 = async (name: string, Body: Buffer) => {
    const [s3, Bucket] = getS3();
    const params = { Bucket, Key: Date.now() + name, Body };

    const data = await s3.upload(params).promise();
    const { Location: url, Key: s3Key } = data;
    const retData = { name, fileType: "image", s3Key, url };
    return retData;
  };

  const filterEntities = async (model: F, params: object) => {
    const [entities, count] = await model.findAndCount(params);
    const retEntries = entities.map((entity: any) => {
      const retData = { ...entity };
      delete retData.s3Key;
      delete retData.url;
      return retData;
    });
    return [retEntries, count] as [Array<any>, number];
  };

  const getEntity = async (model: typeof File, req: Request) => {
    const params: any = { id: Number(req.params.id) };
    if (req.user) params.createdBy = req.user.id;

    const entity = await model.findOne(params);
    if (!entity) return null;

    const data = await downloadFromS3((entity as any).s3Key);
    return data;
  };

  const onDelete = (entity: any) => {
    return deleteInS3(entity.s3Key);
  };

  const transformCreateData = async (_: any, req: Request) => {
    const fileContent = req.file.buffer;
    const fileName = req.file.originalname;
    const storeData = await uploadToS3(fileName, fileContent);
    return [storeData, { name: fileName }];
  };

  const controller = getController({
    model: File,
    allowedMethods: ["list", "retrieve", "create", "delete"],
    filterEntities,
    getEntity,
    onDelete,
    transformCreateData,
    userModel,
    authenticated: { retrieve: false },
    // this is a hack. instead of giving validation middleware, just give it the file middleware
    validations: {
      retrieve: [authQueryValidator, authByQueryMiddleware] as any,
      create: fileMiddleware as any
    }
  });

  return controller;
}

export default getFiles;
