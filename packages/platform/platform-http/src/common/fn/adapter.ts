import {Type} from "@tsed/core";
import {GlobalProviders, injector, ProviderOpts, refValue} from "@tsed/di";

import {PlatformAdapter} from "../services/PlatformAdapter.js";

const ADAPTER = "platform.adapter";

let globalAdapter: Type<PlatformAdapter<any>>;

/**
 * Set the platform adapter token and his dependencies
 */
export function adapter(adapter: Type<PlatformAdapter<any>>, imports?: ProviderOpts[]): Type<PlatformAdapter<any>>;
/**
 * Get the platform adapter token
 */
export function adapter(): Type<PlatformAdapter<any>>;
export function adapter(adapter?: Type<PlatformAdapter<any>>, imports: ProviderOpts[] = []): Type<PlatformAdapter<any>> {
  const ref = refValue<Type<PlatformAdapter<any>>>(ADAPTER);

  if (adapter) {
    globalAdapter ||= adapter;

    imports?.forEach(({token, useClass}) => {
      const provider = GlobalProviders.get(token);
      if (useClass && provider) {
        provider.useClass = useClass;
        injector().set(token, provider);
      }
    });

    injector()
      .addProvider(PlatformAdapter, {
        useClass: adapter
      })
      .alias(PlatformAdapter, "PlatformAdapter");
  }

  ref.value ||= globalAdapter;

  return ref.value as Type<PlatformAdapter<any>>;
}
