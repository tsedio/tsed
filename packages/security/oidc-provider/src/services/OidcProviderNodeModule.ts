import {Type} from "@tsed/core";
import {registerProvider} from "@tsed/di";
// @ts-ignore
import type Provider from "oidc-provider";

export const OIDC_PROVIDER_NODE_MODULE = Symbol.for("oidc:provider:node:module");
// @ts-ignore
export type OIDC_PROVIDER_NODE_MODULE = {Provider: Type<Provider>} & typeof import("oidc-provider");

export {Provider};

registerProvider({
  provide: OIDC_PROVIDER_NODE_MODULE,
  async useAsyncFactory() {
    const mod = await import("oidc-provider");

    return {
      ...mod,
      Provider: mod.default || (mod as any).Provider
    };
  }
});
