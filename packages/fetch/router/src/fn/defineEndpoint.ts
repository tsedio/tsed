import {FetchRouter, type FetchRouteOptions} from "../components/FetchRouter.js";
import type {FetchEndpointOptions} from "../interfaces/FetchEndpointOptions.js";

/**
 * Creates a router containing one declarative endpoint.
 *
 * This is the module-friendly counterpart to `router.get({ ... })`: an endpoint
 * can be exported independently, then mounted with `router.use(endpoint)`.
 */
export function defineEndpoint<const Options extends FetchEndpointOptions>(options: Options): FetchRouter {
  const router = new FetchRouter();
  const {method, ...route} = options;
  const routeOptions = route as FetchRouteOptions;

  switch (method) {
    case "GET":
      return router.get(routeOptions);
    case "POST":
      return router.post(routeOptions);
    case "PUT":
      return router.put(routeOptions);
    case "PATCH":
      return router.patch(routeOptions);
    case "DELETE":
      return router.delete(routeOptions);
    case "HEAD":
      return router.head(routeOptions);
    case "OPTIONS":
      return router.options(routeOptions);
  }
}
