import "@tsed/common";
import {Config} from "knex";

declare global {
  namespace TsED {
    interface Configuration {
      knex: Config;
    }
  }
}
export * from "./decorators/Entity";
export * from "./utils/connect";
