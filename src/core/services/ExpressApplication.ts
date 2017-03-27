/**
 * @module core
 */ /** */

import * as Express from "express";

export type ExpressApplication = Express.Application;
export const ExpressApplication = Symbol("ExpressApplication");
