import {EnvTypes} from "@tsed/core";
import {injectable} from "@tsed/di";

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

export const ConfigService = injectable(Symbol.for("ConfigService"))
  .class(process.env.NODE_ENV === EnvTypes.PROD ? ProdConfigService : DevConfigService)
  .token();

