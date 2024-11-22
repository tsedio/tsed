import {Type} from "@tsed/core";
import {configuration, constant, refValue} from "@tsed/di";

import {PlatformAdapter} from "../services/PlatformAdapter.js";

const ADAPTER = "platform.adapter";

let globalAdapter: Type<PlatformAdapter<any>>;

/**
 * Set or Get the registered platform adapter.
 * Ensure that the adapter is registered before using the platform.
 */
export function adapter(): Type<PlatformAdapter<any>> & {NAME: string};
export function adapter(adapter: Type<PlatformAdapter<any>>): Type<PlatformAdapter<any>> & {NAME: string};
/**
 * Set the platform adapter
 */
export function adapter(adapter?: Type<PlatformAdapter<any>>) {
  const ref = refValue(ADAPTER);

  if (adapter) {
    globalAdapter ||= adapter;
  }

  ref.value ||= globalAdapter;

  return ref.value;
}
