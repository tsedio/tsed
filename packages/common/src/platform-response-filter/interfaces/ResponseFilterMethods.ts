import type {PlatformContext} from "../../platform/domain/PlatformContext";

export interface ResponseFilterMethods<T = unknown> {
  transform(data: T, ctx: PlatformContext): any;
}
