import {AcceptMime, Header} from "@tsed/schema";
import {StoreSet, useDecorators} from "@tsed/core";
import {EventStreamMiddleware} from "../middlewares/EventStreamMiddleware.js";
import {Use} from "@tsed/platform-middlewares";

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
