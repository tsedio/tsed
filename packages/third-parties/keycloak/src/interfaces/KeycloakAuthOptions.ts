import {IAuthOptions} from "@tsed/platform-middlewares";
import {GuardFn} from "keycloak-connect";

export interface KeycloakAuthOptions extends IAuthOptions {
  role?: GuardFn | string;
}
