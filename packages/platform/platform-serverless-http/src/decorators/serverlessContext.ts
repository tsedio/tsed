import {Req} from "@tsed/platform-http";
import {Context} from "aws-lambda";

/**
 * Return the Serverless context
 * @decorator
 */
export function ServerlessContext(): ParameterDecorator {
  return Req("serverless.context");
}

export type ServerlessContext = Context;
