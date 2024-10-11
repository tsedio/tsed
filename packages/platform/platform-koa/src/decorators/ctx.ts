import {UseParam} from "@tsed/platform-params";
import type {Context} from "koa";

/**
 * Return the original Koa context.
 * @decorator
 * @operation
 * @input
 * @koa
 */
export function KoaCtx(): ParameterDecorator {
  return UseParam({
    paramType: "KOA_CTX",
    dataPath: "$ctx.request.ctx",
    useMapper: false,
    useValidation: false
  });
}

/**
 * Return the original Koa context.
 * @decorator
 * @operation
 * @input
 * @koa
 */
export function Ctx(): ParameterDecorator {
  return KoaCtx();
}

export type Ctx = Context;
export type KoaCtx = Context;
