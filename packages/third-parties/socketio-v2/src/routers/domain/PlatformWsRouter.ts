import {Injectable, ProviderScope, Scope} from "@tsed/di";
import {PlatformBaseRouter} from "@tsed/platform-router";

@Injectable()
@Scope(ProviderScope.INSTANCE)
export class PlatformWsRouter extends PlatformBaseRouter {
  publish(event: string, ...handlers: any[]) {
    return this.addRoute("publish", event, handlers);
  }

  broadcast(event: string, ...handlers: any[]) {
    return this.addRoute("broadcast", event, handlers);
  }

  subscribe(event: string, ...handlers: any[]) {
    return this.addRoute("publish", event, handlers);
  }
}
