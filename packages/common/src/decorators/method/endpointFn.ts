import {DecoratorParameters} from "@tsed/core";
import {JsonEntityFn} from "@tsed/schema";
import {EndpointMetadata} from "../../domain";

/**
 *
 * @param fn
 * @decorator
 */
export function EndpointFn(fn: (endpoint: EndpointMetadata, parameters: DecoratorParameters) => void): MethodDecorator {
  return JsonEntityFn<EndpointMetadata>(fn) as any;
}
