import {Context} from "../../platform/decorators/Context";

export interface ExceptionFilterMethods<T = unknown> {
  catch(error: T, ctx: Context): void;
}
