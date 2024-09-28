import {NextFunction, Request, Response} from "express";

export type ResourceHttpHandler = (req: Request, res: Response, next: NextFunction) => void;

export interface ResourceHttpMethodOptions {
  before?: ResourceHttpHandler;
  after?: ResourceHttpHandler;
}

export interface ResourceRestOptions extends ResourceHttpMethodOptions {
  beforePut?: ResourceHttpHandler;
  beforePatch?: ResourceHttpHandler;
  beforePost?: ResourceHttpHandler;
  beforeIndex?: ResourceHttpHandler;
  beforeGet?: ResourceHttpHandler;
  afterPut?: ResourceHttpHandler;
  afterPatch?: ResourceHttpHandler;
  afterPost?: ResourceHttpHandler;
  afterIndex?: ResourceHttpHandler;
  afterGet?: ResourceHttpHandler;
}
