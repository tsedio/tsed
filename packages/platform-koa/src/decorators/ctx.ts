import {mapParamsOptions, UseParam} from "@tsed/common";
import type {Context} from "koa";

/**
 * Return the original Koa context.
 * @decorator
 * @koa
 */
export function KoaCtx(): ParameterDecorator {
  return UseParam("KOA_CTX", {
    useConverter: false,
    useValidation: false
  });
}

/**
 * Return the original Koa context.
 * @decorator
 * @koa
 */
export function Ctx(): ParameterDecorator {
  return KoaCtx();
}

export type Ctx = Context;
export type KoaCtx = Context;
