import {UseAuth} from "@tsed/common";
import {Type, useDecorators} from "@tsed/core";
import {Returns, Security} from "@tsed/schema";
import {KeycloakAuthOptions} from "../interfaces/KeycloakAuthOptions";
import {KeycloakMiddleware} from "../middlewares/KeycloakMiddleware";

export function UseKeycloakAuth(options?: KeycloakAuthOptions, middleware: Type<any> = KeycloakMiddleware): MethodDecorator {
  return useDecorators(UseAuth(middleware, options), Security("oauth2"), Returns(403));
}
