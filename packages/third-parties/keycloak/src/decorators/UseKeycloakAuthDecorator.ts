import {UseAuth} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {Returns, Security} from "@tsed/schema";
import {KeycloakAuthOptions, KeycloakMiddleware} from "@tsed/keycloak";

export function UseKeycloakAuth(options?: KeycloakAuthOptions): MethodDecorator {
  return useDecorators(UseAuth(KeycloakMiddleware, options), Security("oauth2"), Returns(403));
}
