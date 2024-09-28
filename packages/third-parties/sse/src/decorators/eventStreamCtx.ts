import {Context} from "@tsed/platform-params";

import type {EventStreamContext} from "../domain/EventStreamContext.js";

export type EventStreamCtx = EventStreamContext;

export function EventStreamCtx() {
  return Context("EventStreamContext");
}
