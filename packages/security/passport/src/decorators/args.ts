import {useDecorators} from "@tsed/core";
import {Context} from "@tsed/platform-params";

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
