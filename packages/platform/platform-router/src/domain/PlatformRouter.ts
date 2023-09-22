import {Injectable, InjectorService, ProviderScope, Scope} from "@tsed/di";
import {PlatformBaseRouter} from "./PlatformBaseRouter";
import {SinglePathType} from "./SinglePathType";

function printHandler(handler: any) {
  return handler.toString().split("{")[0].trim();
}

@Injectable()
@Scope(ProviderScope.INSTANCE)
export class PlatformRouter extends PlatformBaseRouter {
  constructor(injector: InjectorService) {
    super(injector);
  }

  all(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("all", path, handlers);
  }

  get(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("get", path, handlers);
  }

  post(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("post", path, handlers);
  }

  put(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("put", path, handlers);
  }

  delete(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("delete", path, handlers);
  }

  patch(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("patch", path, handlers);
  }

  head(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("head", path, handlers);
  }

  options(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("options", path, handlers);
  }

  statics(path: string, options: any) {
    return this.addRoute("statics", path, [], options);
  }
}
