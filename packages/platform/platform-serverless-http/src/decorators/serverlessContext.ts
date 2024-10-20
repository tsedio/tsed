import {Req} from "@tsed/platform-http";
import type {Context} from "aws-lambda";

/**
 * Return the Serverless context
 * @decorator
 */
export function ServerlessContext(): ParameterDecorator {
  return Req("serverless.context");
}

export type ServerlessContext = Context;
