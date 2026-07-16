import {context, injector} from "@tsed/di";
import {OpenAPIService} from "../services/OpenAPIService.js";
import type {OpenApiSettings} from "../interfaces/OpenApiSettings.js";

/**
 * Return a middleware to expose the OpenAPI spec.
 */
export function openApiMiddleware(conf: OpenApiSettings) {
  return async () => {
    const ctx = context();
    const spec = await injector().get(OpenAPIService).getOpenAPISpec(conf);

    ctx.response.status(200).body(spec);
  };
}
