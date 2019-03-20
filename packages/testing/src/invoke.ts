import {Type} from "@tsed/core";
import {TestContext} from "./TestContext";

/**
 * Invoke a service with some parameters
 * @param target
 * @param providers
 */
/* istanbul ignore next */
export async function invoke(target: Type<any>, providers: {provide: any | symbol; use: any}[]) {
  return TestContext.invoke(target, providers);
}
