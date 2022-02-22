import {DecoratorParameters} from "@tsed/core";
import {EndpointMetadata, JsonEntityFn} from "@tsed/schema";

/**
 *
 * @param fn
 * @decorator
 * @deprecated Deprecated since 2021-10-05. Use JsonEntityFn instead.
 */
export function EndpointFn(fn: (endpoint: EndpointMetadata, parameters: DecoratorParameters) => void): MethodDecorator {
  return JsonEntityFn<EndpointMetadata>(fn) as any;
}
