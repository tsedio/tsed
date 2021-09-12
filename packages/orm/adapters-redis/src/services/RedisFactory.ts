import {Configuration, registerProvider} from "@tsed/di";
import IoRedis, {RedisOptions} from "ioredis";

registerProvider({
  provide: IoRedis,
  deps: [Configuration],
  useFactory(configuration: Configuration) {
    const options = configuration.get<RedisOptions>("adapters.redis");

    // istanbul ignore next
    if (options) {
      return new IoRedis(options);
    }

    return {};
  }
});
