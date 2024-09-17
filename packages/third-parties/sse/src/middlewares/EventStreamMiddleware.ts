import {Context, PlatformContext} from "@tsed/common";
import {Middleware} from "@tsed/platform-middlewares";
import {EventStreamContext} from "../domain/EventStreamContext.js";

@Middleware()
export class EventStreamMiddleware {
  use(@Context() $ctx: PlatformContext) {
    const opts = $ctx.endpoint.store.get(EventStreamMiddleware, {});

    // Enable stream logs
    $ctx.logger.flush();
    $ctx.logger.maxStackSize = 0;

    const eventStream = new EventStreamContext({
      $ctx,
      ...opts
    });

    $ctx.set("EventStreamContext", eventStream);

    eventStream.writeHead();
  }
}
