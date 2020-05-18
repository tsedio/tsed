import {Req} from "@tsed/common";
import {applyDecorators} from "@tsed/core";

/**
 * Inject args resolve by the passport strategy on verify method.
 * @decorator
 */
export function Args() {
  return applyDecorators(Req("args"));
}

export function Arg(index: number) {
  return applyDecorators(Req(`args.${index}`));
}
