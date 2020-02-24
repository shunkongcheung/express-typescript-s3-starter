import { Request } from "express";
import moment from "moment";

const getContent = (req: Request) => {
  if (req.method.toLowerCase() === "put") {
    return req.body;
  }
  if (req.method.toLowerCase() === "post") {
    return req.body;
  }
  return req.query;
};

const getContentDesc = (req: Request, additionalMsg: string = "") => {
  const time = moment().format("YYYY/MM/DD HH:mm");
  const method = req.method.toUpperCase();
  const url = req.originalUrl || "/";
  const content = getContent(req);

  if (content.password) content.password = "********";
  const strContent = JSON.stringify(content, null, 4);

  additionalMsg = additionalMsg
    ? `\n**MESSAGE**\n${additionalMsg}\n\n**REQUEST**\n`
    : " ";

  return `${time}: ${url} [${method}] ${additionalMsg}${strContent}`;
};

export default getContentDesc;
