import type {Context} from "aws-lambda";
import {Req} from "@tsed/platform-http";

/**
 * Return the Serverless context
 * @decorator
 */
export function ServerlessContext(): ParameterDecorator {
  return Req("serverless.context");
}

export type ServerlessContext = Context;
