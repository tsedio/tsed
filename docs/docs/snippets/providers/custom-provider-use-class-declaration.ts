import {EnvTypes} from "@tsed/core";
import {registerProvider} from "@tsed/di";

export class ConfigService {}

export class DevConfigService {}

registerProvider({
  provide: ConfigService,
  useClass: process.env.NODE_ENV === EnvTypes.PROD ? ConfigService : DevConfigService
});
