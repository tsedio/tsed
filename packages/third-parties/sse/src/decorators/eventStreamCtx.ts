import {Context} from "@tsed/platform-params";
import type {EventStreamContext} from "../domain/EventStreamContext";

export type EventStreamCtx = EventStreamContext;

export function EventStreamCtx() {
  return Context("EventStreamContext");
}
