import {UseAuth} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {Returns, Security} from "@tsed/schema";
import {KeycloakAuthOptions} from "../interfaces/KeycloakAuthOptions";
import {KeycloakMiddleware} from "../middlewares/KeycloakMiddleware";

export function UseKeycloakAuth(options?: KeycloakAuthOptions): MethodDecorator {
  return useDecorators(UseAuth(KeycloakMiddleware, options), Security("oauth2"), Returns(403));
}
