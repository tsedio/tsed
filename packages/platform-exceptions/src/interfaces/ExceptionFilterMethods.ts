import {BaseContext} from "@tsed/di";

export interface ExceptionFilterMethods<T = unknown> {
  catch(error: T, ctx: BaseContext): void;
}
