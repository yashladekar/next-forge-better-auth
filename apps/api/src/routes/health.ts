import { type Request, type Response, Router } from "express";

export const healthRouter = Router();

const HTTP_STATUS_OK = 200;

healthRouter.get("/", (_req: Request, res: Response) => {
  res.status(HTTP_STATUS_OK).send("OK");
});
