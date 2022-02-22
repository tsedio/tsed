import {GuardFn} from "keycloak-connect";

export interface KeycloakAuthOptions {
  role?: GuardFn | string;
}
