import {InjectorService} from "@tsed/di";
import {EndpointMetadata} from "@tsed/schema";
import {HandlerMetadata, HandlerMetadataOptions} from "../domain/HandlerMetadata";
import {HandlerType} from "../interfaces/HandlerType";
import {PlatformRouteWithoutHandlers} from "../interfaces/PlatformRouteOptions";

function isMetadata(input: any) {
  return input instanceof HandlerMetadata;
}

/**
 * @ignore
 */
export function createHandlerMetadata(
  injector: InjectorService,
  obj: any | EndpointMetadata,
  routeOptions: PlatformRouteWithoutHandlers = {}
): HandlerMetadata {
  if (isMetadata(obj)) {
    return obj as HandlerMetadata;
  }

  let options: HandlerMetadataOptions;

  if (obj instanceof EndpointMetadata) {
    const provider = injector.getProvider(routeOptions.token)!;

    options = {
      token: provider.token,
      target: provider.useClass,
      scope: provider.scope,
      type: HandlerType.ENDPOINT,
      propertyKey: obj.propertyKey
    };
  } else {
    const provider = injector.getProvider(obj);

    if (provider) {
      options = {
        token: provider.token,
        target: provider.useClass,
        scope: provider.scope,
        type: HandlerType.MIDDLEWARE,
        propertyKey: "use"
      };
    } else {
      options = {
        target: obj
      };
    }
  }

  options.routeOptions = routeOptions;

  return new HandlerMetadata(options);
}
