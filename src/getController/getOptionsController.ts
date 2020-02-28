import { ValidationChain } from "express-validator";
import { Response } from "express";

interface Props {
  allowedMethods?: Array<Method>;
  authenticated: boolean;
  validations: { [x: string]: Array<ValidationChain> };
}

type Method = "list" | "retrieve" | "create" | "update" | "delete";

type DescType = "string" | "numeric" | "select" | "custom";

interface Desc {
  name: string;
  required: boolean;
  location: "body" | "query" | "params";
  type: DescType;
  options?: Array<string>;
}

interface ValidatorMeta {
  type: DescType;
  options?: Array<string>;
}

function getValidatorMeta({ validator, options }: any): ValidatorMeta {
  if (validator.name === "isIn") return { type: "select", options };
  if (validator.name === "isNumeric") return { type: "numeric" };
  if (validator.toString().includes(`typeof value === 'string'`))
    return { type: "string" };

  return { type: "custom" };
}

function getValidationDesc(
  validationChain: Array<ValidationChain>
): Array<Desc> {
  if (!Array.isArray(validationChain)) return [];
  return validationChain.map((validation: ValidationChain) => {
    // @ts-ignore
    const meta = validation.builder.stack.reduce(
      (o: DescType, c: any) => o || getValidatorMeta(c),
      null
    );
    return {
      // @ts-ignore
      name: validation.builder.fields[0],
      // @ts-ignore
      required: !validation.builder.optional,
      // @ts-ignore
      location: validation.builder.locations[0],
      ...meta
    };
  });
}

function getOptionsController({
  allowedMethods = ["list", "retrieve", "create", "update", "delete"],
  authenticated = true,
  validations
}: Props) {
  const options = { authenticated };

  for (let allowedMethod of allowedMethods) {
    options[allowedMethod] = getValidationDesc(
      validations[allowedMethod] || []
    );
  }

  function getOptions(_: any, res: Response) {
    res.status(200).json(options);
  }

  return { getOptions };
}
export default getOptionsController;
