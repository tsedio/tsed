import {Context} from "@tsed/common";
import {useDecorators} from "@tsed/core";

/**
 * Inject args resolve by the passport strategy on verify method.
 * @decorator
 */
export function Args() {
  return useDecorators(Context("PROTOCOL_ARGS"));
}

export function Arg(index: number) {
  return useDecorators(Context(`PROTOCOL_ARGS.${index}`));
}
