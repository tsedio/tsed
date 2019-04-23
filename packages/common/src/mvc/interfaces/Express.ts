import * as Express from "express";
import {Context} from "../class/Context";
import {RequestLogger} from "../class/RequestLogger";
import {EndpointMetadata} from "../class/EndpointMetadata";

declare module "express" {
  export interface NextFunction extends Function {
    isCalled: boolean;
  }

  export interface Response {
    headersSent: boolean;
  }

  export interface Application {}

  export interface Request {
    id: string;
    ctx: Context;
    log: RequestLogger;

    /**
     * @deprecated
     */
    getContainer(): any;

    /**
     * @deprecated
     */
    createContainer(): void;

    /**
     * @deprecated
     */
    destroyContainer(): void;

    /**
     * @deprecated
     */
    getEndpoint(): EndpointMetadata;

    /**
     * @deprecated
     */
    destroyEndpoint(): void;

    /**
     * @deprecated
     */
    getStoredData(): any;

    /**
     * @deprecated
     * @param obj
     */
    storeData(obj: any): Express.Request;
  }
}
