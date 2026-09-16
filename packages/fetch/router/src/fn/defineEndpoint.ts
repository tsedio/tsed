import {type FetchRouteOptions, FetchRouter} from "../components/FetchRouter.js";
import type {FetchEndpointInput} from "../components/FecthContext.js";
import type {FetchEndpointOptions, FetchEndpointSchemas} from "../interfaces/FetchEndpointOptions.js";

/**
 * Creates a router containing one declarative endpoint.
 *
 * This is the module-friendly counterpart to `router.get({ ... })`: an endpoint
 * can be exported independently, then mounted with `router.use(endpoint)`.
 */
export function defineEndpoint<Input extends FetchEndpointInput | FetchEndpointSchemas = FetchEndpointInput, Output = unknown>(
  options: FetchEndpointOptions<Input, Output>
): FetchRouter;
export function defineEndpoint(options: FetchEndpointOptions<any, any>): FetchRouter {
  const router = new FetchRouter();
  const {method, ...route} = options;
  const routeOptions = route as FetchRouteOptions;

  return router[method.toLowerCase() as Lowercase<typeof method>](routeOptions);
}
