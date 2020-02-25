import { ValidationChain } from "express-validator";
import { Response } from "express";

interface Props {
  allowedMethods?: Array<Method>;
  authenticated: boolean;
  validations: { [x: string]: Array<ValidationChain> };
}

type Method = "list" | "retrieve" | "create" | "update" | "delete";

type DescType = "string" | "numeric" | null;

interface Desc {
  name: string;
  required: boolean;
  location: "body" | "query" | "params";
  type: DescType;
}

function getValidatorType(validator: Function): DescType {
  if (validator.name === "isNumeric") return "numeric";
  if (validator.toString().includes(`typeof value === 'string'`))
    return "string";
  return null;
}

function getValidationDesc(
  validationChain: Array<ValidationChain>
): Array<Desc> {
  if (!Array.isArray(validationChain)) return [];
  return validationChain.map((validation: ValidationChain) => ({
    // @ts-ignore
    name: validation.builder.fields[0],
    // @ts-ignore
    required: !validation.builder.optional,
    // @ts-ignore
    location: validation.builder.locations[0],
    // @ts-ignore
    type: validation.builder.stack.reduce(
      (o: DescType, c: any) => o || getValidatorType(c.validator),
      null
    )
  }));
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
