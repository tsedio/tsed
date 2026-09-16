import type {FetchEndpointInput} from "./FecthContext.js";
import type {FetchEndpointOptions, FetchEndpointSchemas, FetchHandler, FetchMethod} from "../interfaces/FetchEndpointOptions.js";

export type FetchRouteOptions<Input extends FetchEndpointInput | FetchEndpointSchemas = FetchEndpointInput, Output = unknown> = Omit<
  FetchEndpointOptions<Input, Output>,
  "method"
>;

export type FetchAllRouteOptions<Input extends FetchEndpointInput = FetchEndpointInput, Output = unknown> = FetchRouteOptions<
  Input,
  Output
> & {
  methods?: readonly FetchMethod[];
};

/**
 * Consumer-facing router declaration API.
 *
 * It records no routing behavior yet: route matching, request decoding and
 * composition belong to the future platform runtime.
 */
export class FetchRouter {
  get<Input extends FetchEndpointInput | FetchEndpointSchemas = FetchEndpointInput, Output = unknown>(
    options: FetchRouteOptions<Input, Output>
  ): this;
  get<Input extends FetchEndpointInput = FetchEndpointInput>(path: string, handler: FetchHandler<Input>): this;
  get(): this {
    return this;
  }
  post<Input extends FetchEndpointInput | FetchEndpointSchemas = FetchEndpointInput, Output = unknown>(
    options: FetchRouteOptions<Input, Output>
  ): this;
  post<Input extends FetchEndpointInput = FetchEndpointInput>(path: string, handler: FetchHandler<Input>): this;
  post(): this {
    return this;
  }
  put<Input extends FetchEndpointInput | FetchEndpointSchemas = FetchEndpointInput, Output = unknown>(
    options: FetchRouteOptions<Input, Output>
  ): this;
  put<Input extends FetchEndpointInput = FetchEndpointInput>(path: string, handler: FetchHandler<Input>): this;
  put(): this {
    return this;
  }
  patch<Input extends FetchEndpointInput | FetchEndpointSchemas = FetchEndpointInput, Output = unknown>(
    options: FetchRouteOptions<Input, Output>
  ): this;
  patch<Input extends FetchEndpointInput = FetchEndpointInput>(path: string, handler: FetchHandler<Input>): this;
  patch(): this {
    return this;
  }
  delete<Input extends FetchEndpointInput | FetchEndpointSchemas = FetchEndpointInput, Output = unknown>(
    options: FetchRouteOptions<Input, Output>
  ): this;
  delete<Input extends FetchEndpointInput = FetchEndpointInput>(path: string, handler: FetchHandler<Input>): this;
  delete(): this {
    return this;
  }
  head<Input extends FetchEndpointInput | FetchEndpointSchemas = FetchEndpointInput, Output = unknown>(
    options: FetchRouteOptions<Input, Output>
  ): this;
  head<Input extends FetchEndpointInput = FetchEndpointInput>(path: string, handler: FetchHandler<Input>): this;
  head(): this {
    return this;
  }
  options<Input extends FetchEndpointInput | FetchEndpointSchemas = FetchEndpointInput, Output = unknown>(
    options: FetchRouteOptions<Input, Output>
  ): this;
  options<Input extends FetchEndpointInput = FetchEndpointInput>(path: string, handler: FetchHandler<Input>): this;
  options(): this {
    return this;
  }
  all<Input extends FetchEndpointInput | FetchEndpointSchemas = FetchEndpointInput, Output = unknown>(
    options: FetchAllRouteOptions<Input, Output>
  ): this;
  all<Input extends FetchEndpointInput = FetchEndpointInput>(
    path: string,
    handler: FetchHandler<Input>,
    methods?: readonly FetchMethod[]
  ): this;
  all(): this {
    return this;
  }
  use(router: FetchRouter): this;
  use(path: string, router: FetchRouter): this;
  use(): this {
    return this;
  }

  async fetch(_request: Request): Promise<Response> {
    throw new Error("FetchRouter dispatch is not implemented.");
  }
}
