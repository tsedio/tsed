import {AdaptersSettings} from "@tsed/adapters";
import {RedisOptions} from "ioredis";

declare global {
  namespace TsED {
    interface AdaptersOptions extends AdaptersSettings {
      redis: RedisOptions & {
        indexes?: {[propertyKey: string]: Record<string, any>};
      };
    }
  }
}
