import {PlatformHandler, PlatformTest} from "@tsed/common";

export function invokePlatformHandler<T extends PlatformHandler>(token: any): T {
  PlatformTest.injector.getProvider(PlatformHandler)!.useClass = token;

  return PlatformTest.invoke<T>(PlatformHandler) as T;
}
