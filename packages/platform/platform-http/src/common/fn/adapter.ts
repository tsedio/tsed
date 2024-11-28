import {Type} from "@tsed/core";
import {refValue} from "@tsed/di";

import {PlatformAdapter} from "../services/PlatformAdapter.js";

const ADAPTER = "platform.adapter";

let globalAdapter: Type<PlatformAdapter<any>>;

/**
 * Set the platform adapter
 */
export function adapter(adapter?: Type<PlatformAdapter<any>>): Type<PlatformAdapter<any>> {
  const ref = refValue<Type<PlatformAdapter<any>>>(ADAPTER);

  if (adapter) {
    globalAdapter ||= adapter;
  }

  ref.value ||= globalAdapter;

  return ref.value as Type<PlatformAdapter<any>>;
}
