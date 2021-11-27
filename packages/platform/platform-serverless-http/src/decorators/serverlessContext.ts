import {Req} from "@tsed/common";

/**
 * Return the Serverless context
 * @decorator
 */
export function ServerlessContext(): ParameterDecorator {
  return Req("serverless.context");
}
