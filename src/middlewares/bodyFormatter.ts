import mung from "express-mung";

const bodyFormatter = (body: any) => {
  if (Buffer.isBuffer(body)) return body;
  return { result: body };
};

export default mung.json(bodyFormatter);
