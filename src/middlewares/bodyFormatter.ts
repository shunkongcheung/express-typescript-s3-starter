import mung from "express-mung";

const bodyFormatter = (body: any) => {
  return { result: body };
};

export default mung.json(bodyFormatter);
