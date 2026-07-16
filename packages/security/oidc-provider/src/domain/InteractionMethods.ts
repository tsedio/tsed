import type {CanBePromise, KoaContextWithOIDC, UnknownObject, interactionPolicy} from "oidc-provider";

export interface InteractionMethods {
  details?: (ctx: KoaContextWithOIDC) => CanBePromise<UnknownObject>;
  checks?: () => interactionPolicy.Check[];
  $onCreate?: (prompt: interactionPolicy.Prompt) => void | Promise<void>;
  /**
   * @param args Injectable parameters
   */
  $prompt?: (...args: any[]) => any | Promise<any>;
}
