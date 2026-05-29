import {AdaptersSettings} from "@tsed/adapters";
import {RedisClientOptions} from "redis";

declare global {
  namespace TsED {
    interface AdaptersOptions extends AdaptersSettings {
      redis: RedisClientOptions & {
        indexes?: {[propertyKey: string]: Record<string, any>};
      };
    }
  }
}
