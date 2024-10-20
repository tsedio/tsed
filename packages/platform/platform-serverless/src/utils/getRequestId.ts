import type {Context} from "aws-lambda";
import {v4} from "uuid";

import type {ServerlessEvent} from "../domain/ServerlessEvent.js";

export function getRequestId(event: ServerlessEvent, context: Context) {
  if ("headers" in event && event.headers["x-request-id"]) {
    return event.headers["x-request-id"];
  }

  if ("requestContext" in event) {
    return event?.requestContext?.requestId;
  }

  return context?.awsRequestId || v4().replace(/-/gi, "");
}
