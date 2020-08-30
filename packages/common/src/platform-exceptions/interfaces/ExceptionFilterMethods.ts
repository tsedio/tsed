import type {RequestContext} from "../../platform/domain/RequestContext";

export interface ExceptionFilterMethods<T = unknown> {
  catch(error: T, ctx: RequestContext): void;
}
