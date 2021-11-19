import {InjectorService} from "@tsed/di";

export function createHttpServers(injector: InjectorService) {
  const promises = [
    injector.settings.httpPort !== false && import("@tsed/platform-http"),
    injector.settings.httpsPort !== false && import("@tsed/platform-https"),
    ...injector.settings.get("servers", [])
  ]
    .filter(Boolean)
    .map(async (mod: any) => {
      const {ServerModule} = await mod;
      return injector.lazyInvoke(ServerModule);
    });

  return Promise.all(promises);
}
