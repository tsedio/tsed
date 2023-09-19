import Hapi from "@hapi/hapi";

export interface PlatformHapiSettings {
  options?: Hapi.ServerOptions;
  app?: Hapi.Server;
}
