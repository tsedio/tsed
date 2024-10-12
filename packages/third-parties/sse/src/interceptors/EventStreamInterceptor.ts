import {isObservable, isStream} from "@tsed/core";
import type {InterceptorContext, InterceptorMethods} from "@tsed/di";
import {Injectable, InjectContext} from "@tsed/di";
import type {PlatformContext} from "@tsed/platform-http";
import type {Observable} from "rxjs";

import {EventStreamContext} from "../domain/EventStreamContext.js";

@Injectable()
export class EventStreamInterceptor implements InterceptorMethods {
  @InjectContext()
  protected $ctx: PlatformContext;

  async intercept(context: InterceptorContext): Promise<unknown> {
    const result = await context.next();
    const eventStream = this.$ctx.get<EventStreamContext>("EventStreamContext");

    if (eventStream) {
      if (isObservable(result)) {
        eventStream.subscribe(result as Observable<unknown>);

        return;
      }

      if (isStream(result)) {
        eventStream.stream(result as NodeJS.ReadableStream);

        return;
      }
    }

    return result;
  }
}
