import {EnvTypes} from "@tsed/core";

export interface ConfigService {
  get(key: string): any;
}

export class ProdConfigService implements ConfigService {
  get(key: string) {
    return "VALUE PROD";
  }
}

export class DevConfigService implements ConfigService {
  get(key: string) {
    return "VALUE DEV";
  }
}

registerProvider({
  provide: Symbol.for("ConfigService"),
  deps: [],
  useClass: process.env.NODE_ENV === EnvTypes.PROD ? ProdConfigService : DevConfigService
});

