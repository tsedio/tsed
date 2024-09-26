import type {DIContext} from "@tsed/di";

export interface ExceptionFilterMethods<T = unknown> {
  catch(error: T, ctx: DIContext): void;
}
