import type {PlatformContext} from "../../platform/domain/PlatformContext";

export interface ExceptionFilterMethods<T = unknown> {
  catch(error: T, ctx: PlatformContext): void;
}
