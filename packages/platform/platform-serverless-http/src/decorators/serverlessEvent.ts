import {Req} from "@tsed/common";

/**
 * Return the serverless.event
 * @decorator
 */
export function ServerlessEvent(): ParameterDecorator {
  return Req("serverless.event");
}
