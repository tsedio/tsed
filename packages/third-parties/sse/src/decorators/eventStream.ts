import {StoreSet, useDecorators} from "@tsed/core";
import {Use} from "@tsed/platform-middlewares";
import {Header, AcceptMime} from "@tsed/schema";
import {EventStreamMiddleware} from "../middlewares/EventStreamMiddleware.js";

export interface EventStreamOpts {
  headers?: Record<string, string>;
  event?: string;
}

export function EventStream(opts: EventStreamOpts = {}) {
  return useDecorators(
    StoreSet(EventStreamMiddleware, opts),
    Use(EventStreamMiddleware),
    AcceptMime("text/event-stream"),
    Header("Content-Type", "text/event-stream")
  );
}
