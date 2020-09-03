import {PlatformRequest} from "@tsed/common";
import type * as Express from "express";

/**
 * @platform
 * @express
 */
export class PlatformExpressRequest extends PlatformRequest<Express.Request> {}
