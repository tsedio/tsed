import {Req} from "@tsed/platform-http";

/**
 * Return the serverless.event
 * @decorator
 */
export function ServerlessEvent(): ParameterDecorator {
  return Req("serverless.event");
}
