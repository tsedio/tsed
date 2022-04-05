import {PlatformContext, PlatformRequest} from "@tsed/common";
import type Express from "express";

/**
 * @platform
 * @express
 */
export class PlatformExpressRequest extends PlatformRequest<Express.Request> {}
